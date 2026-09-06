# 내일은 분명 맑음 — 해온마을 소개 페이지

프레임워크나 설치 과정 없이 실행되는 정적 단일 페이지입니다. HTML·CSS·JavaScript를 각각 분리해 두어 GitHub에서 바로 수정할 수 있습니다.

## GitHub Pages에 올리기

1. 이 폴더의 파일을 GitHub 저장소 최상위에 그대로 업로드합니다.
2. 저장소의 **Settings → Pages**에서 배포 브랜치와 `/ (root)`를 선택합니다.
3. 표시된 주소로 접속합니다.

`index.html`을 더블클릭해 로컬에서도 확인할 수 있습니다.

## 음악 넣기

MP3 파일을 `assets/audio` 폴더에 아래 이름으로 넣으면 상단 플레이어가 바로 작동합니다.

- `01-tomorrow-will-be-sunny.mp3`
- `02-841-days.mp3`
- `03-blueprint-for-tomorrow.mp3`
- `04-vitals-at-dawn.mp3`
- `05-radio-haeon.mp3`
- `06-sugar-after-the-end.mp3`

곡명이나 파일 경로를 바꾸려면 `index.html` 맨 아래의 `tracks` 배열만 수정하면 됩니다.

## 구조

```text
index.html
style.css
script.js
assets/
  images/
  audio/
README.md
```
