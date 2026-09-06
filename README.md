# 내일은 분명 맑음 — 해온마을 소개 페이지

프레임워크나 설치 과정 없이 실행되는 정적 단일 페이지입니다. HTML·CSS·JavaScript를 각각 분리해 두어 GitHub에서 바로 수정할 수 있습니다.

## GitHub Pages에 올리기

1. 이 폴더의 파일을 GitHub 저장소 최상위에 그대로 업로드합니다.
2. 저장소의 **Settings → Pages**에서 배포 브랜치와 `/ (root)`를 선택합니다.
3. 표시된 주소로 접속합니다.

`index.html`을 더블클릭해 로컬에서도 확인할 수 있습니다.

## 음악 넣기

MP3 파일을 `assets/audio` 폴더에 아래 이름으로 넣으면 상단 플레이어가 바로 작동합니다.

첫 곡은 HTML에 음원 주소를 직접 연결해 페이지가 열릴 때 자동재생을 시도합니다. 브라우저가 소리 있는 자동재생을 차단하면 상단 재생 버튼을 한 번 눌러 시작하면 됩니다.

- `01-tomorrow-will-be-sunny.mp3`
- `02-841-days.mp3`
- `03-blueprint-for-tomorrow.mp3`
- `04-vitals-at-dawn.mp3`
- `05-radio-haeon.mp3`
- `06-sugar-after-the-end.mp3`

곡명이나 파일 경로를 바꾸려면 `script.js`의 `tracks` 배열만 수정하면 됩니다.

상단 메뉴는 `#home`, `#people`, `#rebuild`, `#map` 주소를 사용합니다. 예전에 사용하던 `#about`, `#places`, `#top` 주소도 자동으로 대응합니다.

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
