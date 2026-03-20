# EXO RUN — 개발 노트

> 코드 수정은 반드시 `src/index.html` 에서. 수정 후 `node build.js` 실행하면 `index.html` (배포용) 자동 생성.

---

## ★ 빌드 방법

```
1. src/index.html  수정
2. node build.js   실행  →  index.html 자동 생성 (난독화 + 주석 제거)
3. git add / commit / push
```

- `SETTINGS` 블록 → 첫 번째 `<script>` 태그 (값만, 주석 없음)
- 나머지 JS → 두 번째 `<script>` 태그 (난독화)
- CSS / HTML 주석 자동 제거

---

## ★ GAME SETTINGS 조절 가이드

`src/index.html` 의 `SETTINGS` 객체를 수정 후 빌드.

### 점프 물리

| 키 | 설명 | 현재값 |
|---|---|---|
| `GRAVITY` | 중력 세기. 클수록 빨리 떨어짐 | `1.10` |
| `JUMP_1ST` | 1번 점프 힘. 절댓값 클수록 높이 올라감 | `-16.0` |
| `JUMP_2ND` | 2번 점프 힘 (더블점프) | `-13.5` |

### 게임 속도

| 키 | 설명 | 현재값 |
|---|---|---|
| `SPEED_INIT` | 시작 속도 | `5` |
| `SPEED_STEP` | 구간마다 증가하는 속도 | `0.65` |
| `SPEED_STEP_SCORE` | 몇 점마다 빨라지나 | `200` |
| `SPEED_MAX_STEPS` | 최대 증가 횟수 (최고속도 = SPEED_INIT + MAX_STEPS × STEP) | `8` |

### 장애물 출현 간격 (단위: 프레임, 60fps 기준)

| 키 | 설명 | 현재값 |
|---|---|---|
| `SPAWN_INIT` | 처음 출현 간격 | `88` |
| `SPAWN_MIN` | 최소 출현 간격 (이보다 빨라지지 않음) | `36` |
| `SPAWN_STEP_SCORE` | 몇 점마다 간격이 줄어드나 | `80` |
| `SPAWN_STEP` | 한 번에 줄어드는 프레임 수 | `5` |

### 더블 장애물

| 키 | 설명 | 현재값 |
|---|---|---|
| `DOUBLE_SCORE` | 이 점수 이상부터 더블 장애물 가능 | `200` |
| `DOUBLE_PROB` | 더블 장애물 확률 (0.0 ~ 1.0) | `0.40` |

---

## ★ 초능력 이미지 사이즈 조절

`src/index.html` CSS에서 수정.

### 1. 캐릭터 프레임 안 파워 이미지 (앞·뒤 공통)

```css
.cs-char-ph {
  width:  170% !important;   /* 프레임 크기 대비 % — 클수록 프레임 밖으로 넘침 */
  height: 170% !important;
}
```

### 2. 이름 아래 파워 이미지

```css
.cs-char-power-img {
  height: 80px;   /* px 값 — 클수록 크게 표시 */
}
```

### 3. 글로우 애니메이션 투명도

```css
@keyframes powerGlow {
  0%, 100% { opacity: 0.32; }   /* 어두울 때 (0.0 ~ 1.0) */
  50%       { opacity: 0.58; }   /* 밝을 때   (0.0 ~ 1.0) */
}
```

---

## ★ BGM

`bgm/` 폴더에 순서대로 자동 재생. 페이지 전환 시 이어서 재생.

| 트랙 | 파일명 |
|---|---|
| 01 | EXO-01-Crown |
| 02 | EXO-02-Back It Up |
| 03 | EXO-03-Crazy |
| 04 | EXO-04-Suffocate |
| 05 | EXO-05-Moonlight Shadows |
| 06 | EXO-06-Back Pocket |
| 07 | EXO-07-Touch & Go |
| 08 | EXO-08-Flatline |
| 09 | EXO-09-I'm Home |

> 모바일은 사용자 터치 후 자동 재생 시작 (브라우저 정책).

---

## ★ 파일 구조

| 경로 | 설명 |
|---|---|
| `src/index.html` | 원본 소스 (주석 있음, 여기서 수정) |
| `index.html` | 배포용 (난독화, build.js 가 자동 생성) |
| `build.js` | 빌드 스크립트 |
| `character/[name].webp` | 캐릭터 앞모습 |
| `character/[name]_back.webp` | 캐릭터 뒷모습 |
| `character/[name]_right.webp` | 달리기 이미지 |
| `character/[name]_jump.webp` | 점프 이미지 |
| `image/[파워명].png` | 초능력 이미지 |
| `image/favicon.ico` | 파비콘 |
| `bgm/*.mp3` | 배경음악 |

---

## ★ 주요 기능 메모

| 항목 | 내용 |
|---|---|
| 점수 API | `/api/score` (Google Apps Script 연동) |
| 리더보드 | 상위 10위 표시, 10위 밖이면 내 등수 `···` 아래 별도 표시 |
| 점프 | 더블점프 지원, `#game-page` 전체 터치로 수신 (버블링 방지) |
| 캐릭터 | SUHO·LAY·CHANYEOL·D.O·KAI·SEHUN (스와이프 또는 버튼으로 선택) |
