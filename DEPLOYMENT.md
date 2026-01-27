# OnYou - Vercel 배포 가이드

이 문서는 OnYou 프로젝트를 Vercel에 배포하는 방법을 안내합니다.

## 📋 사전 준비

- [x] GitHub 저장소에 코드 push 완료
- [x] Supabase 프로젝트 생성 완료
- [x] DATABASE_URL 확보
- [ ] Vercel 계정 (GitHub 계정으로 로그인 가능)

---

## 🚀 Vercel 배포 단계

### 1단계: Vercel 계정 생성 및 로그인

1. **Vercel 웹사이트 접속**
   - https://vercel.com 접속
   - "Start Deploying" 또는 "Sign Up" 클릭

2. **GitHub 계정으로 로그인**
   - "Continue with GitHub" 선택
   - GitHub 계정 인증

---

### 2단계: 프로젝트 Import

1. **대시보드에서 "Add New..." 클릭**
   - 우측 상단 "Add New..." 버튼
   - "Project" 선택

2. **GitHub 저장소 선택**
   - "Import Git Repository" 섹션에서
   - `Lennoner/OnYou` 저장소 찾기
   - "Import" 버튼 클릭

3. **프로젝트 설정**
   - Framework Preset: **Next.js** (자동 감지됨)
   - Root Directory: `.` (기본값)
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next` (기본값)

---

### 3단계: 환경 변수 설정 ⚠️ 중요!

**Environment Variables** 섹션에서 아래 변수들을 추가하세요:

#### 필수 환경 변수

1. **DATABASE_URL**
   ```
   Name: DATABASE_URL
   Value: postgresql://postgres:[!Loy2877]@db.eluuwlzvdnsldmodhrmy.supabase.co:5432/postgres
   ```

2. **NEXTAUTH_URL**
   ```
   Name: NEXTAUTH_URL
   Value: https://your-project-name.vercel.app
   ```
   (배포 후 실제 URL로 업데이트 필요)

3. **NEXTAUTH_SECRET**
   ```
   Name: NEXTAUTH_SECRET
   Value: (아래 명령어로 생성한 랜덤 문자열)
   ```

   **생성 방법:**
   ```bash
   # 터미널에서 실행
   openssl rand -base64 32
   ```
   또는 온라인 생성기 사용: https://generate-secret.vercel.app/32

#### 선택 환경 변수 (Google OAuth 사용 시)

4. **GOOGLE_CLIENT_ID**
   ```
   Name: GOOGLE_CLIENT_ID
   Value: (Google Cloud Console에서 발급)
   ```

5. **GOOGLE_CLIENT_SECRET**
   ```
   Name: GOOGLE_CLIENT_SECRET
   Value: (Google Cloud Console에서 발급)
   ```

---

### 4단계: 배포 실행

1. **"Deploy" 버튼 클릭**
   - 모든 환경 변수 설정 완료 후
   - "Deploy" 버튼 클릭

2. **빌드 과정 모니터링**
   - 빌드 로그를 실시간으로 확인
   - 약 2-5분 소요

3. **배포 완료 확인**
   - "Congratulations!" 메시지 확인
   - 배포된 URL 확인 (예: `https://on-you.vercel.app`)

---

### 5단계: 배포 후 설정

#### NEXTAUTH_URL 업데이트

1. **Vercel 대시보드**
   - 프로젝트 선택
   - "Settings" → "Environment Variables"

2. **NEXTAUTH_URL 수정**
   - 기존 `NEXTAUTH_URL` 변수 찾기
   - "Edit" 클릭
   - 실제 배포 URL로 변경
     ```
     https://your-actual-domain.vercel.app
     ```
   - "Save" 클릭

3. **재배포**
   - "Deployments" 탭으로 이동
   - 최신 배포 옆 "⋯" 메뉴 클릭
   - "Redeploy" 선택

---

## ✅ 배포 확인

배포가 완료되면 다음을 확인하세요:

1. **웹사이트 접속**
   - 배포된 URL 브라우저에서 열기
   - 홈페이지가 정상적으로 로드되는지 확인

2. **데이터베이스 연결 확인**
   - 회원가입 또는 로그인 시도
   - 페이지가 정상 작동하는지 확인

3. **Supabase 테이블 확인**
   - Supabase Dashboard → Table Editor
   - User 테이블에 데이터가 생성되었는지 확인

---

## 🔧 문제 해결

### 빌드 에러 발생 시

#### "prisma generate failed"
```bash
# 해결: Build Command 확인
prisma generate && next build
```

#### "DATABASE_URL is not defined"
- Vercel 대시보드에서 환경 변수 확인
- 오타 또는 누락 확인

#### "NextAuth configuration error"
- NEXTAUTH_URL이 배포된 실제 URL과 일치하는지 확인
- NEXTAUTH_SECRET이 설정되었는지 확인

### 데이터베이스 연결 실패

1. **Supabase DATABASE_URL 재확인**
   - Supabase Dashboard → Settings → Database
   - Connection String (URI) 복사
   - Vercel 환경 변수와 일치하는지 확인

2. **Supabase 프로젝트 상태 확인**
   - Supabase 프로젝트가 활성화되어 있는지 확인
   - 무료 플랜 제한 확인

---

## 📊 배포 완료 체크리스트

- [ ] Vercel 프로젝트 import 완료
- [ ] 환경 변수 3개 설정 완료 (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET)
- [ ] 첫 배포 성공
- [ ] NEXTAUTH_URL을 실제 URL로 업데이트
- [ ] 재배포 완료
- [ ] 웹사이트 접속 확인
- [ ] 데이터베이스 연결 테스트
- [ ] 회원가입/로그인 테스트

---

## 🎉 배포 완료!

축하합니다! OnYou가 성공적으로 배포되었습니다.

**배포된 URL:** `https://your-project.vercel.app`

### 다음 단계

- **커스텀 도메인 연결** (선택)
  - Vercel Settings → Domains
  - 원하는 도메인 연결

- **Analytics 설정** (선택)
  - Vercel Analytics 활성화
  - 사용자 트래픽 모니터링

- **성능 모니터링**
  - Vercel Dashboard에서 성능 지표 확인
  - 에러 로그 모니터링

---

## 📞 지원

문제가 발생하면:
- Vercel 빌드 로그 확인
- Supabase 로그 확인
- GitHub Issues에 문의

---

**배포 날짜:** 2026-01-27
**버전:** v1.0.0
**데이터베이스:** Supabase PostgreSQL
**호스팅:** Vercel
