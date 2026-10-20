import type { Metadata } from "next";
import AppFrame from "./AppFrame";
import "./globals.css";

export const metadata: Metadata = {
  title: "룰메이트",
  description: "내가 정한 조건으로 종목을 걸러 보고, 계획과 결과를 매매일지에 남기는 도구예요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body>
        <AppFrame />
        {children}
      </body>
    </html>
  );
}
