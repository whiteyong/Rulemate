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

## 토스증권 실제 시세 (내 컴퓨터에서만)

토스증권 Open API 약관(제5조)상 시세는 **계좌 주인 본인의 매매 목적**으로만 쓸 수 있고 남에게 제공하면 안 돼요. 그래서 실제 시세는 이 컴퓨터에서 연 룰메이트(`localhost`)에서만 보이고, 배포된 주소(`*.web.app`)는 계속 가상 데이터를 써요.

### 처음 한 번
1. 토스증권 WTS(PC 웹) › 설정 › **Open API** 에서 약관에 동의하고 `client_id`, `client_secret` 을 발급받아요.
2. 같은 메뉴의 **허용 IP 관리** 에 이 컴퓨터가 인터넷에 나갈 때 쓰는 IP(공인 IP)를 등록해요. 집 인터넷 IP가 바뀌면 다시 등록해야 해요.
3. `.env.example` 을 `.env.local` 로 복사해서 두 값을 넣어요. `.env.local` 은 git에 올라가지 않아요.

### 쓸 때마다 (터미널 두 개)
```bash
npm run toss     # 토스 연결 서버 (127.0.0.1:3200, 이 컴퓨터에서만 접속 가능)
npm run dev      # 룰메이트 (http://localhost:3000)
```

- 연결되면 상단 장 상태가 실제 시각으로 바뀌고, 종목 상세에 "토스증권 시세"가 보여요. 연결이 안 되면 화면 위에 안내가 나오고 가상 데이터로 보여요.
- **대상 종목**: 거래대금 상위 100개 중 코스피·코스닥 보통주(ETF·ETN·리츠 제외) + 매매일지에서 계획·보유 중인 종목.
- **실제 값으로 계산하는 조건 31개**: 가격·등락·출발 점프·오늘 범위·출렁임(ATR)·평균 단가(VWAP)·거래대금·평소보다 북적임·이동평균·정배열·골든크로스·이격도·RSI·스토캐스틱·볼린저·최고가 경신·큰 상승/하락 봉·꼬리·1/3/6개월 수익률·상한가까지·시가총액·상장일·주의 종목. 나머지(수급·실적·몸값 등)는 "준비 중"으로 보이고 계산에서 빠져요.
- 시세는 장중 1분, 장 밖에서는 10분마다 다시 받아요. 차트는 최근 200분의 1분봉을 5분봉으로 묶어 그려요.
- **조회 전용**이에요. 주문·조건주문·계좌 API는 부르지 않아요.

### 키 없이 개발하기
```bash
npm run toss:fake                                                   # 가짜 토스 서버 (127.0.0.1:3299)
TOSS_BASE_URL=http://127.0.0.1:3299 TOSS_CLIENT_ID=dev TOSS_CLIENT_SECRET=dev node server/toss-local.mjs
```
가짜 서버는 공식 스펙과 같은 응답 모양에 만든 숫자("가짜종목N")를 돌려주고, 문서의 호출 한도를 넘으면 429를 돌려줘요.

## 구조

| 경로 | 내용 |
|---|---|
| `app/` | Next.js App Router. 모든 라우트가 같은 앱 셸(`AppFrame`)을 쓰고, 주소로 화면을 골라요 |
| `components/RulemateApp.tsx` | 프로토타입 `class Component`를 옮긴 상태·계산 로직. `renderVals()`가 화면용 값을 만들어요 |
| `components/*Page.tsx`, `*Modal.tsx`, `Shell.tsx`, `Toast.tsx` | 화면 마크업 (아래 참고) |
| `lib/data.ts` | `data/*.json`을 읽어 조건 사전·가상 종목·색 토큰으로 바꿔요. 가상 지표 계산식도 여기 있어요 |
| `server/toss-local.mjs`, `server/indicators.mjs` | 토스 연결 서버와 조건 값 계산 |
| `lib/market.ts` | 앱 쪽 토스 연결 (localhost에서만) |
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
