# 욱개로그

English | [한국어](./README.ko.md)

A personal blog on GitHub Pages, built with the Chirpy theme.

## Run locally

```bash
bundle install
bundle exec jekyll serve            # include drafts: --drafts
```

## Write a post

```bash
./bin/new-post "Post title" optional-slug
./bin/new-post --draft "Draft title" optional-slug
```

- Post: `_posts/YYYY-MM-DD-slug.md`
- Draft: `_drafts/slug.md`

### Front matter keys

- `description`: one-line summary used on cards, in search results, and as the meta description. An empty value (`""`) leaves the card blank, so delete the key when you don't use it.
- `image.path` / `image.alt`: thumbnail shown at the top of the post and on its card.
- `series` / `series_order`: group posts into a series.

## Series

Register a series in `_data/series.yml`, then set `series` and `series_order` in each post's front matter. The series list appears beside a post only when the series has two or more posts.

```yaml
# _data/series.yml
nestjs-ecommerce:
  name: "Building an e-commerce app with NestJS"
  description: "From design to deployment"
```

## Deployment

Pushing to `main` runs `.github/workflows/pages-deploy.yml`, which deploys the site with GitHub Actions. Set the repository's Pages source to `GitHub Actions`.
