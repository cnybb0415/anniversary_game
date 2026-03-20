# EXO RUN — 개발 노트

> 코드 내 주석은 모두 이 파일로 이전됨. index.html 수정 시 이 문서를 참고.

---

## ★ GAME SETTINGS 조절 가이드

`index.html` 첫 번째 `<script>` 태그 안의 `SETTINGS` 객체를 수정.

### 점프 물리

| 키 | 설명 | 기본값 |
|---|---|---|
| `GRAVITY` | 중력 세기. 클수록 빨리 떨어짐 | `0.65` |
| `JUMP_1ST` | 1번 점프 힘. 절댓값 클수록 높이 올라감 | `-15.5` |
| `JUMP_2ND` | 2번 점프 힘 (더블점프) | `-12.5` |

### 게임 속도

| 키 | 설명 | 기본값 |
|---|---|---|
| `SPEED_INIT` | 시작 속도 | `6` |
| `SPEED_STEP` | 구간마다 증가하는 속도 | `0.65` |
| `SPEED_STEP_SCORE` | 몇 점마다 빨라지나 | `200` |
| `SPEED_MAX_STEPS` | 최대 증가 횟수 (최고속도 = SPEED_INIT + MAX_STEPS × STEP) | `8` |

### 장애물 출현 간격 (단위: 프레임, 60fps 기준)

| 키 | 설명 | 기본값 |
|---|---|---|
| `SPAWN_INIT` | 처음 출현 간격 | `88` |
| `SPAWN_MIN` | 최소 출현 간격 (이보다 빨라지지 않음) | `36` |
| `SPAWN_STEP_SCORE` | 몇 점마다 간격이 줄어드나 | `80` |
| `SPAWN_STEP` | 한 번에 줄어드는 프레임 수 | `5` |

### 더블 장애물

| 키 | 설명 | 기본값 |
|---|---|---|
| `DOUBLE_SCORE` | 이 점수 이상부터 더블 장애물 가능 | `200` |
| `DOUBLE_PROB` | 더블 장애물 확률 (0.0 ~ 1.0) | `0.40` |

---

## ★ 초능력 이미지 사이즈 조절

CSS에서 아래 두 군데를 수정.

### 1. 캐릭터 프레임 안 파워 이미지 (앞·뒤 공통)

```css
.cs-char-ph {
  width:  170% !important;   /* ★ 프레임 내 파워이미지 크기 */
  height: 170% !important;   /* ★ 프레임 내 파워이미지 크기 */
}
```
- `width/height` : 프레임 크기 대비 %. 클수록 프레임 밖으로 넘침
- 예) `170%` = 프레임의 1.7배 크기

### 2. 이름 아래 파워 이미지

```css
.cs-char-power-img {
  height: 80px;   /* ★ 이름 아래 파워이미지 크기 */
}
```
- `height` : px 값. 클수록 크게 표시

### 3. 글로우 애니메이션 투명도

```css
@keyframes powerGlow {
  0%, 100% { opacity: 0.32; }   /* 어두울 때 투명도 (0.0 ~ 1.0) */
  50%       { opacity: 0.58; }   /* 밝을 때 투명도   (0.0 ~ 1.0) */
}
```

---

## ★ 빌드 방법 (난독화)

```bash
node build.js
```

- `SETTINGS` 블록은 그대로 유지 (첫 번째 `<script>` 태그)
- 나머지 JS는 난독화되어 두 번째 `<script>` 태그에 들어감
- CSS 주석 자동 제거

---

## ★ 구조 메모

| 항목 | 내용 |
|---|---|
| 점수 API | `/api/score` (Google Apps Script 연동) |
| 리더보드 | 상위 10위 표시, 10위 밖이면 내 등수 `···` 아래 별도 표시 |
| 점프 | 더블점프 지원 (`jumpCount < 2`), game-page 전체 터치로 수신 |
| BGM | `bgm/` 폴더, 순서대로 자동 재생, 페이지 전환 시 이어서 재생 |
| 캐릭터 이미지 | `character/[name].webp` (front), `_back.webp`, `_right.webp`, `_jump.webp` |
| 초능력 이미지 | `image/[파워명].png` |
