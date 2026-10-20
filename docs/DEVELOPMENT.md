# 개발 가이드 (1단계)

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ 에 정적 사이트 생성
npm run start      # out/ 을 로컬에서 띄워 보기
```

- 데이터는 모두 가상 데이터(`data/*.json`)이고, 규칙·매매일지·설정은 이 브라우저의 localStorage에만 저장돼요.
- 화면 상태 미리보기: 주소 뒤에 `?demo=loading|empty|closed|delay|error` 를 붙이면 불러오는 중 / 결과 0개 / 장 마감 / 데이터 지연 / 오류 화면을 볼 수 있어요.
- 처음 안내와 저장된 데이터를 지우려면 브라우저 개발자 도구에서 `rm_b2c_state_v1`, `rm_b2c_consent` 키를 지워요.

## 구조

| 경로 | 내용 |
|---|---|
| `app/` | Next.js App Router. 모든 라우트가 같은 앱 셸(`AppFrame`)을 쓰고, 주소로 화면을 골라요 |
| `components/RulemateApp.tsx` | 프로토타입 `class Component`를 옮긴 상태·계산 로직. `renderVals()`가 화면용 값을 만들어요 |
| `components/*Page.tsx`, `*Modal.tsx`, `Shell.tsx`, `Toast.tsx` | 프로토타입 템플릿에서 생성한 화면 (아래 참고) |
| `lib/data.ts` | `data/*.json`을 읽어 조건 사전·가상 종목·색 토큰으로 바꿔요. 가상 지표 계산식도 여기 있어요 |
| `lib/seed.ts` | 처음 방문 시 보여줄 예시 규칙 3개와 매매일지 |
| `design/`, `docs/` | Claude Design 핸드오프 원본 (정답 화면·PRD) |

## 화면 컴포넌트 생성

화면 마크업은 `design/Rulemate B2C.dc.html` 템플릿을 그대로 JSX로 바꿔 만들었어요. 프로토타입이 바뀌면 다시 생성할 수 있어요.

```bash
npm run gen:components
```

생성된 파일을 직접 고치면 다시 생성할 때 덮어써지니, 프로토타입 쪽을 고치거나 생성을 멈추고 직접 관리하기로 정한 뒤 고쳐 주세요.

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
