# 개발 가이드 (1단계)

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ 에 정적 사이트 생성
npm run start      # out/ 을 로컬에서 띄워 보기
```

- 처음 방문하면 규칙·매매일지·투자금이 모두 비어 있어요. 종목·공시·뉴스는 가상 데이터(`data/*.json`, `components/RulemateApp.tsx`)예요.
- 규칙·매매일지·설정은 이 브라우저의 localStorage(`rm_b2c_state_v2`)에만 저장돼요.
- 예시 데이터로 보기: 주소 뒤에 `?sample=1` 을 붙이면 프로토타입의 예시 규칙 3개와 매매일지가 보여요. 이때 바꾼 내용은 저장되지 않아요.
- 화면 상태 미리보기: 주소 뒤에 `?demo=loading|empty|closed|delay|error` 를 붙이면 불러오는 중 / 결과 0개 / 장 마감 / 데이터 지연 / 오류 화면을 볼 수 있어요.
- 처음 안내와 저장된 데이터를 지우려면 브라우저 개발자 도구에서 `rm_b2c_state_v2`, `rm_b2c_consent` 키를 지워요.

## 구조

| 경로 | 내용 |
|---|---|
| `app/` | Next.js App Router. 모든 라우트가 같은 앱 셸(`AppFrame`)을 쓰고, 주소로 화면을 골라요 |
| `components/RulemateApp.tsx` | 프로토타입 `class Component`를 옮긴 상태·계산 로직. `renderVals()`가 화면용 값을 만들어요 |
| `components/*Page.tsx`, `*Modal.tsx`, `Shell.tsx`, `Toast.tsx` | 화면 마크업 (아래 참고) |
| `lib/data.ts` | `data/*.json`을 읽어 조건 사전·가상 종목·색 토큰으로 바꿔요. 가상 지표 계산식도 여기 있어요 |
| `lib/seed.ts` | `?sample=1` 로 볼 수 있는 예시 규칙 3개와 매매일지 |
| `design/`, `docs/` | Claude Design 핸드오프 원본 (정답 화면·PRD) |

## 화면 컴포넌트

화면 마크업은 처음에 `design/Rulemate B2C.dc.html` 템플릿을 JSX로 자동 변환해 만들었어요(`scripts/convert-prototype.mjs`). 빈 상태처럼 프로토타입에 없던 화면이 생기면서 지금은 **직접 고쳐서 관리**해요. 변환 스크립트를 다시 돌리면 이 수정이 덮어써지니, 참고용으로만 두세요.

## 배포 (Firebase Hosting)

`next.config.ts`의 `output: "export"`로 정적 파일을 만들고 `firebase.json`이 `out/`을 올려요.

| 환경 | Firebase 프로젝트 | 주소 |
|---|---|---|
| 개발 (`dev`, 기본값) | `rulemate-dev` | https://rulemate-dev.web.app |
| 운영 (`prod`) | `rulemate-4d887` | https://rulemate-4d887.web.app |

```bash
npm run deploy:dev      # 개발에 배포 — 먼저 여기서 확인해요
npm run deploy:prod     # 운영에 배포 — 개발에서 확인한 뒤에만
```

- `.firebaserc`의 기본 프로젝트는 개발이에요. `--project`를 빼고 `firebase deploy`를 해도 운영에는 올라가지 않아요.
- 2단계에서 로그인·DB를 붙일 때도 개발/운영 프로젝트를 나눠서 테스트 데이터가 운영에 섞이지 않게 해요.
- Firebase CLI 계정: `whiteyong2@gmail.com` (두 프로젝트 모두 소유자)
