# 블로그 다듬기 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 Chirpy 블로그(`iamkanguk97.github.io`)에 한글 날짜·아바타 자리·Recently Updated·글 시리즈 패널·About 타임라인·Categories 대시보드를 4개의 독립 PR로 추가한다.

**Architecture:** Chirpy 테마 파일을 사이트 레벨의 `_includes` / `_layouts` / `_data` / `_sass` 로 오버라이드한다. 스타일은 저장소의 기존 방식대로 `assets/css/jekyll-theme-chirpy.scss` 한 곳에서 `@use`로 `_sass/custom/_*.scss` 부분 파일을 불러온다(별도 CSS 링크 없음). 데이터(시리즈, About)는 `_data/*.yml`에 두고 Liquid include가 읽는다.

**Tech Stack:** Jekyll 4.x, jekyll-theme-chirpy 7.6.0 (Gemfile `~> 7.5`), Liquid, SCSS, d3 v7 + d3-cloud 1.2.7 (CDN, Categories 페이지만), Ruby 3.x (Homebrew), GitHub Actions 배포.

**Spec:** `docs/superpowers/specs/2026-09-30-blog-polish-design.md`

## Global Constraints

- 기존 글 10개(`_posts/*.md`)의 내용·front matter·URL은 수정하지 않는다.
- `_config.yml`에서 바꾸는 키는 `avatar` 하나뿐이다. giscus, 메뉴 순서, 푸터는 손대지 않는다.
- 커스텀 CSS는 Chirpy CSS 변수(`--card-bg`, `--link-color`, `--text-muted-color`, `--main-border-color`, `--heading-color`, `--timeline-color`, `--timeline-node-bg` 등)만 써서 다크/라이트 모두에서 동작해야 한다. 색상 hex 값을 직접 쓰는 것은 워드클라우드 팔레트 1곳만 허용한다.
- 테마 원본을 복사한 파일에는 첫 줄 주석으로 기준 버전 `jekyll-theme-chirpy v7.6.0`을 적는다.
- 사이드바·패널 제목은 기존 오버라이드가 영어(`Trending Tags`, `HOME`)이므로 새 패널 제목도 영어로 통일한다(`Recently Updated`, `Contents`는 테마 로케일 그대로).
- 커밋 메시지는 Conventional Commits(`feat:`, `fix:`, `docs:`, `chore:`), 영어. push·PR 생성 전에는 반드시 사용자에게 확인한다.
- 각 Task 브랜치는 `main`에서 분기하고, `bundle exec jekyll build` 가 exit 0이고 출력에 `Error`가 없어야 커밋한다.

## Review Focus

1. **`_data/about.yml`의 `years`에 없는 연도의 글** — 주제·이야기 없이 글 목록만은 나와야 한다. 사라지면 안 된다. (Task 3 Step 6 검증)
2. **`series`가 있는데 같은 시리즈 글이 1개뿐인 글** — 패널이 렌더링되지 않아야 한다(빈 박스 금지). (Task 2 Step 8 검증)
3. **`series`에 적은 id가 `series.yml`에 없는 글** — 빌드가 실패하면 안 되고, 패널 제목이 id 그대로 나와야 한다. (Task 2 Step 8 검증)
4. **d3 CDN이 로드되지 않는 환경** — Categories 페이지의 통계와 목록은 정상이어야 하고 콘솔 에러도 없어야 한다. (Task 4 Step 5 JS의 존재 확인 + Step 8 검증)
5. **`description` 없는 기존 글** — About 타임라인과 카드에서 빈 줄이나 `nil` 문자열이 출력되면 안 된다. (Task 3 Step 6 검증)

---

## 파일 구조

| 경로 | 역할 | Task |
|---|---|---|
| `_data/locales/ko-KR.yml` | 테마 ko-KR 로케일 전체 복사 + 날짜 형식만 변경 | 1 |
| `assets/images/avatar.png` | 프로필 사진 자리(placeholder 렌더링) | 1 |
| `_includes/update-list.html` | Recently Updated 패널(테마 원본 + 영어 제목) | 1 |
| `bin/new-post` | 글 생성 스크립트 front matter 확장 | 1, 2 |
| `README.md` | 아바타 경로·글 양식·시리즈·About 데이터 안내 | 1, 2, 3 |
| `_data/series.yml` | 시리즈 메타데이터 | 2 |
| `_includes/panel/series.html` | 글 우측 시리즈 패널 | 2 |
| `_sass/custom/_series.scss` | 시리즈 패널 스타일 | 2 |
| `_layouts/post.html` | `panel_includes`에 `panel/series` 추가 | 2 |
| `assets/css/jekyll-theme-chirpy.scss` | `@use 'custom/...'` 추가 | 2, 3, 4 |
| `_data/about.yml` | About 소개·연도별 주제/이야기/키워드 | 3 |
| `_includes/about-timeline.html` | 연도별 타임라인(글 목록 자동 생성) | 3 |
| `_sass/custom/_about-timeline.scss` | 타임라인 스타일 | 3 |
| `_tabs/about.md` | 데이터 기반으로 교체 | 3 |
| `_includes/category-list.html` | 테마 categories 레이아웃 본문 복사 | 4 |
| `_layouts/categories.html` | 통계 + 워드클라우드 + `category-list` include | 4 |
| `assets/js/category-cloud.js` | d3-cloud 렌더링 | 4 |
| `_sass/custom/_categories-dashboard.scss` | 통계 카드·클라우드 스타일 | 4 |

---

### Task 0: 로컬 환경 준비 (PR 없음)

**Files:** 없음 (저장소 밖 설치)

**Interfaces:**
- Produces: `bundle exec jekyll build` / `serve` 가 동작하는 환경. 이후 모든 Task가 의존.

- [ ] **Step 1: Homebrew Ruby 설치** (사용자 승인 완료: "Homebrew로 ruby 설치")

```bash
brew install ruby
```

- [ ] **Step 2: PATH 설정 후 버전 확인**

```bash
echo 'export PATH="$(brew --prefix ruby)/bin:$PATH"' >> ~/.zshrc
export PATH="$(brew --prefix ruby)/bin:$PATH"
ruby -v   # 기대: ruby 3.x
```

- [ ] **Step 3: 저장소 의존성 설치**

```bash
cd ~/workspace/iamkanguk97.github.io
git submodule update --init --recursive
bundle install
```

기대: `Bundle complete!`. `Gemfile.lock`이 생기면 커밋하지 않는다(`.gitignore`에 없으면 Task 1 첫 커밋에서 제외).

- [ ] **Step 4: 기준 빌드 확인**

```bash
bundle exec jekyll build 2>&1 | tail -3
ls _site/index.html
```

기대: `done in N seconds`, `_site/index.html` 존재. 이 상태를 "기준 빌드"라 부른다.

- [ ] **Step 5: 스크린샷 헬퍼 준비**

```bash
cat > /tmp/shot.sh <<'EOF'
#!/usr/bin/env bash
# usage: shot.sh <url> <out.png> [height]
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,${3:-1200} --screenshot="$2" "$1" 2>/dev/null
EOF
chmod +x /tmp/shot.sh
```

---

### Task 1: 기본 다듬기 — 브랜치 `feature/basic-polish`

**Files:**
- Create: `_data/locales/ko-KR.yml`, `assets/images/avatar.png`
- Modify: `_config.yml:60` (`avatar`), `_includes/update-list.html`, `bin/new-post`, `README.md`
- Delete: `assets/images/profile-avatar.svg`

**Interfaces:**
- Produces: `bin/new-post`가 만드는 front matter에 `description` 키(Task 2·3의 include가 `post.description`을 읽는다).

- [ ] **Step 1: 브랜치 생성**

```bash
git checkout main && git pull && git checkout -b feature/basic-polish
```

- [ ] **Step 2: 로케일 파일 복사 후 날짜 형식만 변경**

```bash
mkdir -p _data/locales
curl -sL https://raw.githubusercontent.com/cotes2020/jekyll-theme-chirpy/v7.6.0/_data/locales/ko-KR.yml -o _data/locales/ko-KR.yml
```

파일 맨 위에 한 줄 추가하고, `df.post` 두 줄을 바꾼다.

```yaml
# Copied from jekyll-theme-chirpy v7.6.0; only df.post is changed (Korean date format).
```

```yaml
df:
  post:
    strftime: "%Y년 %m월 %d일"
    dayjs: "YYYY년 MM월 DD일"
```

- [ ] **Step 3: 빌드해서 날짜 형식 검증**

```bash
bundle exec jekyll build 2>&1 | grep -iE 'error' ; echo "exit=$?"
grep -oE 'data-df="[^"]*"' _site/index.html | sort -u
grep -oE '[0-9]{4}년 [0-9]{2}월 [0-9]{2}일' _site/index.html | head -2
```

기대: grep error 결과 없음(`exit=1`), `data-df="YYYY년 MM월 DD일"`, 카드에 `2026년 04월 07일` 형식이 보인다.

- [ ] **Step 4: 커밋**

```bash
git add _data/locales/ko-KR.yml
git commit -m "feat: show post dates in Korean format

Override the theme's ko-KR locale so dates render as YYYY년 MM월 DD일
on cards and post headers."
```

- [ ] **Step 5: 아바타 자리 만들기** — 현재 SVG를 PNG로 렌더링해 새 경로에 둔다.

```bash
qlmanage -t -s 448 -o /tmp assets/images/profile-avatar.svg >/dev/null 2>&1
mv /tmp/profile-avatar.svg.png assets/images/avatar.png
git rm -q assets/images/profile-avatar.svg
sed -i '' 's#^avatar: .*#avatar: /assets/images/avatar.png#' _config.yml
grep -n '^avatar' _config.yml
```

기대: `avatar: /assets/images/avatar.png`. `file assets/images/avatar.png`가 `PNG image data, 448 x 448`.

`qlmanage`가 PNG를 만들지 못하면 대안: `/tmp/shot.sh "file://$PWD/assets/images/profile-avatar.svg" /tmp/a.png 448` 후 `sips -c 448 448 /tmp/a.png --out assets/images/avatar.png`.

- [ ] **Step 6: README의 "프로필 사진 변경" 절 갱신**

기존 절을 다음으로 교체한다.

```markdown
## 프로필 사진 변경

사이드바 아바타는 `assets/images/avatar.png`입니다. 지금 들어 있는 것은 자리만 잡아둔 기본 이미지입니다.

실제 사진으로 바꾸려면 정사각형(권장 448×448 이상) PNG를 같은 이름으로 덮어쓰기만 하면 됩니다.
JPG를 쓰고 싶으면 파일을 `assets/images/avatar.jpg`로 넣고 `_config.yml`의 `avatar` 값을 그 경로로 바꿉니다.
```

- [ ] **Step 7: 빌드 후 아바타 검증, 커밋**

```bash
bundle exec jekyll build 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -o 'src="/assets/images/avatar.png"' _site/index.html
ls _site/assets/images/avatar.png
git add _config.yml assets/images/avatar.png README.md
git commit -m "feat: reserve avatar slot at assets/images/avatar.png

Render the placeholder SVG to PNG under the final avatar path so a real
photo can replace it later by overwriting one file."
```

- [ ] **Step 8: Recently Updated 패널 복구** — 테마 원본을 가져와 제목만 영어로 고정한다(기존 `trending-tags.html` 오버라이드와 같은 방식).

```bash
curl -sL https://raw.githubusercontent.com/cotes2020/jekyll-theme-chirpy/v7.6.0/_includes/update-list.html -o _includes/update-list.html
```

첫 줄 주석을 바꾸고, 제목 줄을 교체한다.

```html
<!-- Copied from jekyll-theme-chirpy v7.6.0; heading fixed to English to match trending-tags.html -->
```

```html
    <h2 class="panel-heading">Recently Updated</h2>
```

- [ ] **Step 9: 빌드 후 패널 검증, 커밋**

```bash
bundle exec jekyll build 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -o 'panel-heading">[^<]*' _site/index.html
grep -c 'id="access-lastmod"' _site/index.html
```

기대: `Recently Updated`와 `Trending Tags` 둘 다, `access-lastmod` 1개.

```bash
git add _includes/update-list.html
git commit -m "feat: restore Recently Updated panel

The panel was intentionally blanked earlier. Bring back the theme include
with an English heading; it falls back to post date when no edit exists."
```

- [ ] **Step 10: `bin/new-post` front matter 확장** — `content=$(cat <<EOF ... EOF)` 블록을 다음으로 교체한다.

```bash
content=$(cat <<EOF
---
title: "$title"
date: $timestamp
categories: [notes]
tags: []
description: ""
# image:
#   path: /assets/images/posts/$slug.png
#   alt: ""
# series: example-series
# series_order: 1
---

## TL;DR

1.
2.
3.

## 문제

- 무엇을 해결하려 했나?

## 접근

- 왜 이 방법을 골랐나?

## 결과

- 적용 후 무엇이 달라졌나?
EOF
)
```

(`layout: post`는 Chirpy가 `_posts`에 기본 적용하므로 제거. `excerpt`는 테마가 읽지 않는 키라 `description`으로 교체.)

- [ ] **Step 11: 스크립트 검증**

```bash
./bin/new-post --dry-run "테스트 글" test-post | sed -n 1,14p
```

기대: `description: ""`, 주석 처리된 `image`/`series` 4줄, `## TL;DR`. `_posts`에 파일이 생기지 않는다.

- [ ] **Step 12: README "글 작성" 절에 양식 설명 추가 후 커밋**

"글 작성" 절 끝에 추가:

```markdown
### front matter 키

- `description`: 카드와 검색 결과에 보이는 한 줄 요약. 비워두면 본문 첫 문단이 쓰입니다.
- `image.path` / `image.alt`: 글 상단과 카드 오른쪽에 나오는 썸네일. 주석을 풀고 경로를 채웁니다.
- `series` / `series_order`: 같은 시리즈 글을 묶습니다. 자세한 내용은 아래 "시리즈" 절.
```

```bash
git add bin/new-post README.md
git commit -m "feat: extend new-post template with description, image and TL;DR

Replace the unused excerpt key with Chirpy's description, add commented
image/series keys, and start the body with a TL;DR section."
```

- [ ] **Step 13: 화면 검증 (라이트/다크)**

```bash
bundle exec jekyll serve --port 4000 >/tmp/jekyll.log 2>&1 &
sleep 8
/tmp/shot.sh http://127.0.0.1:4000/ /tmp/t1_home.png
```

캡처를 열어 확인: 사이드바 아바타 표시, 카드 날짜가 `YYYY년 MM월 DD일`, 우측에 Recently Updated 5개 + Trending Tags. 다크/라이트는 테마 토글이 localStorage 기반이라 헤드리스에서는 `prefers-color-scheme`으로 나뉜다. 한 번은 기본, 한 번은 `--force-dark-mode` 플래그를 `/tmp/shot.sh`에 임시로 붙여 캡처한다. 확인 후 `kill %1`.

- [ ] **Step 14: push·PR (사용자 확인 후)**

사용자에게 "feature/basic-polish를 push하고 PR을 열어도 될까요?"를 묻고 승인 후:

```bash
git push -u origin feature/basic-polish
gh pr create --base main --title "feat: basic polish (Korean dates, avatar slot, Recently Updated, post template)" --body "$(cat <<'EOF'
## Summary
Bring the blog's baseline closer to the reference (jeonje.github.io) with settings-only changes: Korean date format, a fixed avatar path, the Recently Updated panel, and a richer new-post template.

## Changes
- Override `_data/locales/ko-KR.yml` so dates render as `YYYY년 MM월 DD일`
- Move avatar to `assets/images/avatar.png` (placeholder rendered from the old SVG); README explains how to replace it
- Restore `_includes/update-list.html` (Recently Updated) — it had been intentionally blanked before; heading fixed to English like Trending Tags
- `bin/new-post`: `excerpt` → `description`, commented `image`/`series` keys, TL;DR section

## Testing
- `bundle exec jekyll build` clean
- Verified `_site/index.html`: `data-df="YYYY년 MM월 DD일"`, avatar `src`, `#access-lastmod` present
- `./bin/new-post --dry-run` output checked
- Local screenshots of home in light and dark

🤖 Generated with Claude Code
EOF
)"
```

---

### Task 2: 글 시리즈 패널 — 브랜치 `feature/post-series`

**Files:**
- Create: `_data/series.yml`, `_includes/panel/series.html`, `_sass/custom/_series.scss`
- Modify: `_layouts/post.html:1-9` (front matter), `assets/css/jekyll-theme-chirpy.scss` (`@use` 추가), `README.md`

**Interfaces:**
- Consumes: 글 front matter 키 `series: <string>`, `series_order: <integer>`; `_data/series.yml[<id>].name`, `.description`.
- Produces: `_sass/custom/` 디렉터리와 `@use 'custom/series';` 관례 — Task 3·4가 같은 방식으로 부분 파일을 추가한다.

- [ ] **Step 1: 브랜치 생성** (Task 1 PR이 병합된 뒤 `main`에서)

```bash
git checkout main && git pull && git checkout -b feature/post-series
```

- [ ] **Step 2: 시리즈 데이터 파일 (빈 구조 + 형식 예시)**

`_data/series.yml`:

```yaml
# 글 시리즈 메타데이터.
# 글 front matter에 `series: <id>`와 `series_order: <숫자>`를 적으면
# 같은 id의 글이 2개 이상일 때 글 오른쪽에 시리즈 패널이 표시됩니다.
#
# 형식:
# example-series:
#   name: "시리즈 표시 이름"
#   description: "한 줄 설명 (선택)"
{}
```

- [ ] **Step 3: 테스트용 초안 2개 작성** (커밋하지 않음)

```bash
cat > _drafts/series-test-1.md <<'EOF'
---
title: "시리즈 테스트 1"
date: 2026-09-01 09:00:00 +0900
categories: [notes]
series: test-series
series_order: 1
---
첫 번째 글.
EOF
cat > _drafts/series-test-2.md <<'EOF'
---
title: "시리즈 테스트 2"
date: 2026-09-02 09:00:00 +0900
categories: [notes]
series: test-series
series_order: 2
---
두 번째 글.
EOF
cat > _drafts/series-lonely.md <<'EOF'
---
title: "혼자인 시리즈"
date: 2026-09-03 09:00:00 +0900
categories: [notes]
series: lonely-series
series_order: 1
---
같은 시리즈 글이 하나뿐.
EOF
```

- [ ] **Step 4: 실패 확인** — 패널이 아직 없으므로 빌드 결과에 클래스가 없어야 한다.

```bash
bundle exec jekyll build --drafts 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -c 'series-panel' _site/posts/series-test-1/index.html
```

기대: `0`.

- [ ] **Step 5: 패널 include 작성**

`_includes/panel/series.html`:

```html
<!-- Series navigation panel: shown only when the post belongs to a series with 2+ posts -->
{% if page.series %}
  {% assign series_posts = site.posts | where: 'series', page.series | sort: 'series_order' %}
  {% assign series_size = series_posts | size %}

  {% if series_size > 1 %}
    {% assign series_meta = site.data.series[page.series] %}
    {% assign series_name = series_meta.name | default: page.series %}

    <section class="series-panel">
      <h2 class="panel-heading">
        <i class="fas fa-layer-group fa-fw me-1"></i>{{ series_name }}
      </h2>
      {% if series_meta.description %}
        <p class="series-panel__desc text-muted">{{ series_meta.description }}</p>
      {% endif %}

      <ol class="series-panel__list list-unstyled">
        {% for post in series_posts %}
          <li class="series-panel__item{% if post.url == page.url %} is-current{% endif %}">
            <span class="series-panel__no">{{ post.series_order }}</span>
            <span class="series-panel__body">
              <span class="series-panel__date text-muted">{{ post.date | date: '%y.%m.%d' }}</span>
              {% if post.url == page.url %}
                <span class="series-panel__title">{{ post.title }}</span>
              {% else %}
                <a class="series-panel__title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
              {% endif %}
            </span>
          </li>
        {% endfor %}
      </ol>
    </section>
  {% endif %}
{% endif %}
```

- [ ] **Step 6: 레이아웃에 패널 등록**

`_layouts/post.html` front matter의 `panel_includes`를 다음으로 바꾼다(시리즈가 목차 위).

```yaml
panel_includes:
  - panel/series
  - toc
```

- [ ] **Step 7: 스타일 추가**

`_sass/custom/_series.scss`:

```scss
/* Post series panel (right side, above TOC) */
.series-panel {
  margin-bottom: 1.75rem;
  padding: 0.9rem 1rem 0.6rem;
  border: 1px solid var(--main-border-color);
  border-radius: 0.75rem;
  background: var(--card-bg);

  .panel-heading {
    font-size: 0.95rem;
    margin-bottom: 0.35rem;
  }

  &__desc {
    font-size: 0.8rem;
    margin-bottom: 0.6rem;
  }

  &__list {
    margin: 0;
    padding: 0;
  }

  &__item {
    display: flex;
    gap: 0.6rem;
    padding: 0.4rem 0;
    border-top: 1px solid var(--main-border-color);

    &:first-child {
      border-top: 0;
    }
  }

  &__no {
    flex: 0 0 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    background: var(--main-border-color);
    color: var(--text-muted-color);
    font-size: 0.7rem;
    line-height: 1.4rem;
    text-align: center;
  }

  &__body {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__date {
    font-size: 0.7rem;
  }

  &__title {
    font-size: 0.85rem;
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .is-current {
    .series-panel__no {
      background: var(--link-color);
      color: var(--card-bg);
    }

    .series-panel__title {
      color: var(--link-color);
      font-weight: 600;
    }
  }
}
```

`assets/css/jekyll-theme-chirpy.scss`의 `/* append your custom style below */` 바로 아래에 추가:

```scss
@use 'custom/series';
```

- [ ] **Step 8: 빌드 후 검증 (표시·미표시·미등록 id)**

```bash
bundle exec jekyll build --drafts 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -c 'class="series-panel"' _site/posts/series-test-1/index.html   # 기대 1
grep -c 'is-current' _site/posts/series-test-1/index.html               # 기대 1
grep -o 'panel-heading">[^<]*<i[^>]*></i>[^<]*' _site/posts/series-test-1/index.html  # 기대: test-series (series.yml에 없으므로 id 그대로)
grep -c 'series-panel' _site/posts/series-lonely/index.html             # 기대 0
grep -c 'series-panel' _site/posts/api-boundaries-need-validation/index.html  # 기대 0 (기존 글 영향 없음)
grep -c 'series-panel' _site/assets/css/jekyll-theme-chirpy.css         # 기대 1 이상
```

- [ ] **Step 9: `series.yml`에 테스트 시리즈 이름을 잠시 넣어 이름 표시 확인**

`_data/series.yml`의 `{}`를 임시로 다음으로 바꾸고 빌드:

```yaml
test-series:
  name: "테스트 시리즈"
  description: "설명 줄"
```

```bash
bundle exec jekyll build --drafts 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -o '테스트 시리즈' _site/posts/series-test-1/index.html | head -1
grep -o 'series-panel__desc[^>]*>설명 줄' _site/posts/series-test-1/index.html
```

확인 후 `series.yml`을 `{}` 상태로 되돌린다.

- [ ] **Step 10: 화면 검증**

```bash
bundle exec jekyll serve --drafts --port 4000 >/tmp/jekyll.log 2>&1 &
sleep 8
/tmp/shot.sh http://127.0.0.1:4000/posts/series-test-2/ /tmp/t2_series.png
kill %1
```

캡처 확인: 우측 상단에 시리즈 박스, 2번 항목이 강조, 그 아래 Contents(목차). 글자가 잘리지 않고 다크 배경에서 대비가 충분한지.

- [ ] **Step 11: 테스트 초안 삭제, README 절 추가, 커밋**

```bash
rm _drafts/series-test-1.md _drafts/series-test-2.md _drafts/series-lonely.md
```

README "글 작성" 절 뒤에 추가:

```markdown
## 시리즈

연재 글은 `_data/series.yml`에 시리즈를 등록하고, 각 글 front matter에 `series`와 `series_order`를 적습니다.

```yaml
# _data/series.yml
nestjs-ecommerce:
  name: "NestJS로 이커머스 만들기"
  description: "설계부터 배포까지"
```

```yaml
# 글 front matter
series: nestjs-ecommerce
series_order: 3
```

같은 시리즈 글이 2개 이상일 때만 글 오른쪽에 시리즈 목록이 나타납니다.
```

```bash
git add _data/series.yml _includes/panel/series.html _sass/custom/_series.scss _layouts/post.html assets/css/jekyll-theme-chirpy.scss README.md
git commit -m "feat: add series navigation panel to posts

Posts that share a series id (with 2+ posts) get an ordered list of the
series in the right panel above the TOC. Series names and descriptions
live in _data/series.yml."
```

- [ ] **Step 12: push·PR (사용자 확인 후)**

```bash
git push -u origin feature/post-series
gh pr create --base main --title "feat: add series navigation panel to posts" --body "$(cat <<'EOF'
## Summary
Add a right-panel series navigator for posts that share a `series` id, modelled on jeonje.github.io but implemented with a small include + SCSS partial.

## Changes
- `_data/series.yml`: series metadata (name, description)
- `_includes/panel/series.html`: renders only when 2+ posts share the series; current post highlighted
- `_sass/custom/_series.scss` via `@use` in the main stylesheet
- `_layouts/post.html`: `panel_includes: [panel/series, toc]`
- README: how to register a series

## Testing
- `bundle exec jekyll build --drafts` clean with three temporary drafts (2 in a series, 1 alone)
- Verified: panel present on series posts, absent on the lone post and on existing posts, unknown id falls back to the id as title
- Local screenshot of a series post

🤖 Generated with Claude Code
EOF
)"
```

---

### Task 3: About 타임라인 — 브랜치 `feature/about-timeline`

**Files:**
- Create: `_data/about.yml`, `_includes/about-timeline.html`, `_sass/custom/_about-timeline.scss`
- Modify: `_tabs/about.md`, `assets/css/jekyll-theme-chirpy.scss`, `README.md`

**Interfaces:**
- Consumes: `post.description`(Task 1의 템플릿 키), `site.posts`.
- Produces: `_data/about.yml` 스키마 — `intro: string`, `timeline.title: string`, `timeline.years[]: { year: "YYYY", theme, story, keywords[] }`.

- [ ] **Step 1: 브랜치 생성**

```bash
git checkout main && git pull && git checkout -b feature/about-timeline
```

- [ ] **Step 2: 데이터 파일** — 현재 About 문구를 placeholder로 옮긴다.

`_data/about.yml`:

```yaml
# About 페이지 데이터. 글 목록은 _posts에서 연도별로 자동 생성되므로 여기엔
# 소개글과 연도별 주제·이야기·키워드만 적습니다. years에 없는 연도는 글 목록만 표시됩니다.

intro: >-
  안녕하세요. Backend Engineer Jason입니다. 백엔드 개발을 하며 마주친 기록과 메모,
  일상에서 남기고 싶은 생각을 이곳에 적습니다. 짧더라도 실제 도움이 되는 내용을 남기고,
  코드만 적지 않고 왜 그렇게 설계했는지 같이 적으려 합니다.

timeline:
  title: "Timeline"
  years:
    - year: "2026"
      theme: "기록하기"
      story: >-
        블로그를 다시 세우고, 운영에서 배운 것과 작은 사이드 프로젝트의 판단 기준을
        글로 남기기 시작한 해. (이 문단은 placeholder입니다. 직접 다듬어 주세요.)
      keywords:
        - "기록"
        - "백엔드"
```

- [ ] **Step 3: 실패 확인** — 아직 include가 없으므로 About 빌드 결과에 타임라인 클래스가 없어야 한다.

```bash
bundle exec jekyll build 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -c 'about-timeline' _site/about/index.html
```

기대: `0`.

- [ ] **Step 4: 타임라인 include 작성**

`_includes/about-timeline.html`:

```html
<!-- Year-by-year timeline. Year meta (theme/story/keywords) comes from _data/about.yml;
     the post list under each year is generated from site.posts. -->
{% assign tl = site.data.about.timeline %}
{% assign posts_by_year = site.posts | group_by_exp: 'post', "post.date | date: '%Y'" %}

<section class="about-timeline">
  <h2 id="timeline">{{ tl.title | default: 'Timeline' }}</h2>

  <div class="about-timeline__track">
    {% for group in posts_by_year %}
      {% assign year = group.name %}
      {% assign meta = tl.years | where: 'year', year | first %}

      <article class="about-timeline__year">
        <header class="about-timeline__head">
          <span class="about-timeline__dot" aria-hidden="true"></span>
          <span class="about-timeline__num">{{ year }}</span>
          {% if meta.theme %}
            <span class="about-timeline__theme">{{ meta.theme }}</span>
          {% endif %}
        </header>

        {% if meta.story %}
          <p class="about-timeline__story">{{ meta.story }}</p>
        {% endif %}

        {% if meta.keywords and meta.keywords.size > 0 %}
          <ul class="about-timeline__keywords list-unstyled">
            {% for kw in meta.keywords %}
              <li>{{ kw }}</li>
            {% endfor %}
          </ul>
        {% endif %}

        <ul class="about-timeline__posts list-unstyled">
          {% for post in group.items %}
            <li class="about-timeline__post">
              <span class="about-timeline__month text-muted">{{ post.date | date: '%-m월' }}</span>
              <span class="about-timeline__post-body">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                {% if post.description and post.description != '' %}
                  <span class="about-timeline__summary text-muted">{{ post.description }}</span>
                {% endif %}
              </span>
            </li>
          {% endfor %}
        </ul>
      </article>
    {% endfor %}
  </div>
</section>
```

- [ ] **Step 5: About 탭 교체**

`_tabs/about.md` 전체:

```markdown
---
title: About
icon: fas fa-info-circle
order: 4
---

{{ site.data.about.intro }}

{% include about-timeline.html %}
```

- [ ] **Step 6: 빌드 후 검증 (연도 자동 생성·없는 연도·description 없는 글)**

```bash
bundle exec jekyll build 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -c 'about-timeline__year' _site/about/index.html          # 기대: 글이 있는 연도 수 (현재 1: 2026)
grep -c 'about-timeline__post"' _site/about/index.html          # 기대: 10 (글 수)
grep -c '기록하기' _site/about/index.html                       # 기대: 1 (theme)
grep -c 'about-timeline__summary' _site/about/index.html        # 기대: description 있는 글 수 이하, 빈 span 없음
grep -c '>nil<\|>null<' _site/about/index.html                  # 기대: 0
```

**없는 연도 검증**: 임시 초안을 2024년 날짜로 만들고 `--drafts`로 빌드해 `about-timeline__year`가 2로 늘고 2024 블록에 `about-timeline__theme`가 없는지 확인한 뒤 초안을 지운다.

```bash
printf -- '---\ntitle: "옛 글"\ndate: 2024-05-01 09:00:00 +0900\ncategories: [notes]\n---\n본문\n' > _drafts/old-post.md
bundle exec jekyll build --drafts 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -c 'about-timeline__year' _site/about/index.html   # 기대 2
grep -A3 'about-timeline__num">2024' _site/about/index.html | grep -c 'about-timeline__theme'  # 기대 0
rm _drafts/old-post.md
```

- [ ] **Step 7: 스타일 추가**

`_sass/custom/_about-timeline.scss`:

```scss
/* About page timeline */
.about-timeline {
  margin-top: 2rem;

  &__track {
    position: relative;
    padding-left: 1.5rem;
    border-left: 2px solid var(--timeline-color);
  }

  &__year {
    position: relative;
    padding-bottom: 2.5rem;
  }

  &__head {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }

  &__dot {
    position: absolute;
    left: calc(-1.5rem - 7px);
    top: 0.45rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--timeline-year-dot-color);
    border: 2px solid var(--main-bg);
  }

  &__num {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--heading-color);
  }

  &__theme {
    font-size: 0.95rem;
    color: var(--text-muted-color);
  }

  &__story {
    margin-bottom: 0.75rem;
    line-height: 1.75;
  }

  &__keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1rem;

    li {
      padding: 0.15rem 0.6rem;
      border: 1px solid var(--main-border-color);
      border-radius: 0.4rem;
      font-size: 0.8rem;
      color: var(--text-muted-color);
    }
  }

  &__posts {
    margin: 0;
  }

  &__post {
    display: flex;
    gap: 0.9rem;
    padding: 0.65rem 0;
    border-top: 1px solid var(--main-border-color);

    &:first-child {
      border-top: 0;
    }
  }

  &__month {
    flex: 0 0 2.4rem;
    font-size: 0.8rem;
    padding-top: 0.15rem;
  }

  &__post-body {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    a {
      font-weight: 600;
    }
  }

  &__summary {
    font-size: 0.85rem;
  }
}
```

`assets/css/jekyll-theme-chirpy.scss`의 `@use 'custom/series';` 아래에 추가:

```scss
@use 'custom/about-timeline';
```

- [ ] **Step 8: 빌드·화면 검증**

```bash
bundle exec jekyll build 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -c 'about-timeline__dot' _site/assets/css/jekyll-theme-chirpy.css   # 기대 1 이상
bundle exec jekyll serve --port 4000 >/tmp/jekyll.log 2>&1 &
sleep 8
/tmp/shot.sh http://127.0.0.1:4000/about/ /tmp/t3_about.png 1400
kill %1
```

캡처 확인: 소개 문단 → Timeline 제목 → 세로 선과 점, 2026 · 기록하기, 이야기, 키워드 칩, 월 + 제목 + 요약 목록. 참고 캡처(`ref_about.png`)와 나란히 놓고 시각적으로 비슷한 밀도인지 본다.

- [ ] **Step 9: README 절 추가, 커밋**

README에 "시리즈" 절 뒤 추가:

```markdown
## About 페이지

`_tabs/about.md`는 `_data/about.yml`을 읽어 그립니다.

- `intro`: 첫 소개 문단
- `timeline.years[]`: 연도별 `theme`(한 단어 주제), `story`(문단), `keywords`(칩)

연도별 글 목록은 `_posts`에서 자동으로 만들어지므로 글을 쓸 때마다 이 파일을 고칠 필요는 없습니다.
`years`에 없는 연도는 글 목록만 표시됩니다.
```

```bash
git add _data/about.yml _includes/about-timeline.html _sass/custom/_about-timeline.scss _tabs/about.md assets/css/jekyll-theme-chirpy.scss README.md
git commit -m "feat: add year-by-year timeline to About page

Year theme/story/keywords come from _data/about.yml; the post list under
each year is generated from _posts so it never goes stale."
```

- [ ] **Step 10: push·PR (사용자 확인 후)**

```bash
git push -u origin feature/about-timeline
gh pr create --base main --title "feat: add year-by-year timeline to About page" --body "$(cat <<'EOF'
## Summary
Replace the plain About page with a data-driven timeline. Unlike the reference blog, the post list per year is generated from `_posts`; only the yearly theme/story/keywords are hand-written.

## Changes
- `_data/about.yml`: intro + per-year theme/story/keywords (placeholder text for 2026)
- `_includes/about-timeline.html`: groups `site.posts` by year, merges year meta when present
- `_sass/custom/_about-timeline.scss` via `@use`
- `_tabs/about.md`: intro + include only
- README: how to edit the data

## Testing
- `bundle exec jekyll build` clean
- Verified year block count = years with posts, post count = 10, no `nil` output, years missing from `about.yml` still list their posts (checked with a temporary 2024 draft)
- Local screenshot of /about/

🤖 Generated with Claude Code
EOF
)"
```

---

### Task 4: Categories 대시보드 — 브랜치 `feature/categories-dashboard`

**Files:**
- Create: `_includes/category-list.html`, `_layouts/categories.html`, `assets/js/category-cloud.js`, `_sass/custom/_categories-dashboard.scss`
- Modify: `assets/css/jekyll-theme-chirpy.scss`

**Interfaces:**
- Consumes: `site.categories`, `site.posts`.
- Produces: `<script id="category-data" type="application/json">` — `[{ "text": string, "size": number, "url": string }]`; `assets/js/category-cloud.js`가 이것과 `#category-cloud` 컨테이너를 읽는다.

- [ ] **Step 1: 브랜치 생성**

```bash
git checkout main && git pull && git checkout -b feature/categories-dashboard
```

- [ ] **Step 2: 테마 카테고리 목록을 include로 분리**

```bash
curl -sL https://raw.githubusercontent.com/cotes2020/jekyll-theme-chirpy/v7.6.0/_layouts/categories.html -o /tmp/categories.html
# front matter(첫 4줄: ---, layout: page, 주석, ---)를 떼고 본문만 include로
sed '1,4d' /tmp/categories.html > _includes/category-list.html
```

첫 줄에 추가:

```html
<!-- Copied from jekyll-theme-chirpy v7.6.0 _layouts/categories.html (body only); do not edit the list markup here -->
```

`_includes/category-list.html`의 첫 Liquid 줄 `{% include lang.html %}`은 그대로 둔다(변수 `lang` 필요).

- [ ] **Step 3: 실패 확인** — 새 레이아웃이 없으니 통계 클래스가 없어야 한다.

```bash
bundle exec jekyll build 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -c 'category-stats' _site/categories/index.html
```

기대: `0`.

- [ ] **Step 4: 레이아웃 작성**

`_layouts/categories.html`:

```html
---
layout: page
# Categories with a stats row, a word cloud, and the theme's category list
---

{% include lang.html %}

{% assign total_posts = site.posts | size %}
{% assign total_categories = site.categories | size %}

{% assign top_name = '' %}
{% assign top_count = 0 %}
{% for category in site.categories %}
  {% assign count = category[1] | size %}
  {% if count > top_count %}
    {% assign top_count = count %}
    {% assign top_name = category[0] %}
  {% endif %}
{% endfor %}

<div class="category-stats card mb-4">
  <div class="category-stats__item">
    <span class="category-stats__num">{{ total_posts }}</span>
    <span class="category-stats__label">Posts</span>
  </div>
  <div class="category-stats__item">
    <span class="category-stats__num">{{ total_categories }}</span>
    <span class="category-stats__label">Categories</span>
  </div>
  <div class="category-stats__item">
    <span class="category-stats__num">{{ top_count }}</span>
    <span class="category-stats__label">{{ top_name }}</span>
  </div>
</div>

{% if total_categories >= 3 %}
  <div id="category-cloud" class="category-cloud card mb-4" aria-label="Category word cloud"></div>

  <script id="category-data" type="application/json">
    [
      {% for category in site.categories %}
        {% assign name = category[0] %}
        {% capture url %}/categories/{{ name | slugify | url_encode }}/{% endcapture %}
        { "text": {{ name | jsonify }}, "size": {{ category[1] | size }}, "url": {{ url | relative_url | jsonify }} }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  </script>

  <script defer src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/d3-cloud@1.2.7/build/d3.layout.cloud.min.js"></script>
  <script defer src="{{ '/assets/js/category-cloud.js' | relative_url }}"></script>
{% endif %}

{% include category-list.html %}
```

- [ ] **Step 5: 워드클라우드 스크립트**

`assets/js/category-cloud.js`:

```js
/* Draws a category word cloud with d3 + d3-cloud.
   Silently does nothing if the libraries failed to load or there is no data. */
(function () {
  'use strict';

  var CLOUD_HEIGHT = 300;
  var MIN_FONT = 14;
  var MAX_FONT = 52;
  var PADDING = 6;
  var ROTATIONS = [0, 0, 0, 90];
  var PALETTE = ['#4f8cff', '#ff6b6b', '#2ec4b6', '#ffb347', '#a78bfa', '#f472b6', '#34d399', '#f59e0b'];

  function render() {
    var container = document.getElementById('category-cloud');
    var dataNode = document.getElementById('category-data');
    if (!container || !dataNode) return;
    if (typeof window.d3 === 'undefined' || typeof window.d3.layout === 'undefined' || !window.d3.layout.cloud) return;

    var words;
    try {
      words = JSON.parse(dataNode.textContent);
    } catch (err) {
      console.warn('[category-cloud] invalid data', err);
      return;
    }
    if (!Array.isArray(words) || words.length === 0) return;

    var width = container.clientWidth || 600;
    var sizes = words.map(function (w) { return w.size; });
    var fontScale = d3.scaleLog()
      .domain([Math.max(1, d3.min(sizes)), Math.max(2, d3.max(sizes))])
      .range([MIN_FONT, MAX_FONT]);

    container.innerHTML = '';

    d3.layout.cloud()
      .size([width, CLOUD_HEIGHT])
      .words(words.map(function (w) { return { text: w.text, size: fontScale(w.size), url: w.url }; }))
      .padding(PADDING)
      .rotate(function () { return ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)]; })
      .font('inherit')
      .fontSize(function (d) { return d.size; })
      .on('end', draw)
      .start();

    function draw(placed) {
      var svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', CLOUD_HEIGHT)
        .attr('role', 'img');

      svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + CLOUD_HEIGHT / 2 + ')')
        .selectAll('a')
        .data(placed)
        .enter()
        .append('a')
        .attr('href', function (d) { return d.url; })
        .append('text')
        .style('font-size', function (d) { return d.size + 'px'; })
        .style('font-weight', 700)
        .style('fill', function (d, i) { return PALETTE[i % PALETTE.length]; })
        .attr('text-anchor', 'middle')
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')rotate(' + d.rotate + ')'; })
        .text(function (d) { return d.text; });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
```

- [ ] **Step 6: 스타일 추가**

`_sass/custom/_categories-dashboard.scss`:

```scss
/* Categories page: stats row + word cloud */
.category-stats {
  display: flex;
  justify-content: space-around;
  padding: 1.25rem 0.5rem;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }

  &__num {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--heading-color);
    line-height: 1.1;
  }

  &__label {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--text-muted-color);
    max-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.category-cloud {
  min-height: 300px;
  padding: 0.5rem;
  overflow: hidden;

  svg {
    display: block;
    max-width: 100%;
  }

  a text {
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  a:hover text {
    opacity: 0.7;
  }
}
```

`assets/css/jekyll-theme-chirpy.scss`의 `@use 'custom/about-timeline';` 아래에 추가:

```scss
@use 'custom/categories-dashboard';
```

- [ ] **Step 7: 빌드 후 정적 검증**

```bash
bundle exec jekyll build 2>&1 | grep -iE 'error'; echo "exit=$?"
grep -c 'category-stats__item' _site/categories/index.html        # 기대 3
grep -o 'category-stats__num">[0-9]*' _site/categories/index.html # 기대: 10, <카테고리 수>, <최다 수>
ls _posts | wc -l                                                  # 첫 숫자와 같아야 함
grep -c 'class="card categories"' _site/categories/index.html     # 기대: 1 이상 (기존 목록 유지)
python3 -c "import json,re,sys;h=open('_site/categories/index.html').read();m=re.search(r'id=\"category-data\"[^>]*>(.*?)</script>',h,re.S);d=json.loads(m.group(1));print(len(d), d[0])"
```

마지막 명령은 JSON이 유효하고 `{'text':..., 'size':..., 'url': '/categories/.../'}` 형태인지 보여준다.

- [ ] **Step 8: 화면·콘솔 검증 (CDN 정상 / CDN 차단)**

```bash
bundle exec jekyll serve --port 4000 >/tmp/jekyll.log 2>&1 &
sleep 8
/tmp/shot.sh http://127.0.0.1:4000/categories/ /tmp/t4_categories.png 1400
```

캡처 확인: 통계 3칸 → 컬러 워드클라우드 → 카테고리 목록. 그리고 CDN 차단 상황은 Chrome 헤드리스에 `--host-resolver-rules="MAP cdn.jsdelivr.net 127.0.0.1"`을 `/tmp/shot.sh`에 임시로 붙여 다시 캡처한다. 기대: 클라우드 영역만 비고 통계·목록은 정상. 콘솔 에러 확인은 `--enable-logging=stderr --v=0`을 붙여 stderr에 `Uncaught`가 없는지 본다.

```bash
kill %1
```

- [ ] **Step 9: 커밋**

```bash
git add _includes/category-list.html _layouts/categories.html assets/js/category-cloud.js _sass/custom/_categories-dashboard.scss assets/css/jekyll-theme-chirpy.scss
git commit -m "feat: add stats row and word cloud to Categories page

Show post/category counts and the largest category above a d3-cloud word
cloud (CDN, degrades to nothing if blocked). The theme's category list is
kept as-is via _includes/category-list.html."
```

- [ ] **Step 10: push·PR (사용자 확인 후)**

```bash
git push -u origin feature/categories-dashboard
gh pr create --base main --title "feat: add stats row and word cloud to Categories page" --body "$(cat <<'EOF'
## Summary
Turn the Categories page into a small dashboard: three stat tiles, a clickable word cloud (d3 + d3-cloud from jsDelivr), and the unchanged theme category list below.

## Changes
- `_layouts/categories.html`: stats + cloud container + JSON data + `{% include category-list.html %}`
- `_includes/category-list.html`: body of the theme's v7.6.0 categories layout, unchanged
- `assets/js/category-cloud.js`: renders the cloud; no-op if d3 is missing or data is invalid
- `_sass/custom/_categories-dashboard.scss` via `@use`
- Cloud hidden when fewer than 3 categories

## Testing
- `bundle exec jekyll build` clean; stat numbers match `_posts` count and `site.categories`
- JSON payload validated with a small Python check
- Screenshots with CDN reachable and with `cdn.jsdelivr.net` blocked (page still renders, no console errors)

🤖 Generated with Claude Code
EOF
)"
```

---

## 마무리 확인 (모든 PR 병합 후)

- [ ] GitHub Actions `pages-deploy` 성공 확인: `gh run list --limit 3`
- [ ] 배포 사이트 확인: `curl -sL https://iamkanguk97.github.io/ | grep -o 'data-df="[^"]*"' | sort -u` → `YYYY년 MM월 DD일`
- [ ] `/tmp/shot.sh https://iamkanguk97.github.io/categories/ /tmp/final_categories.png` 로 워드클라우드가 실제 배포에서도 그려지는지
- [ ] 사용자에게 남은 일 안내: `assets/images/avatar.png` 교체, `_data/about.yml` 문장 다듬기, 연재 글이 생기면 `_data/series.yml` 등록
