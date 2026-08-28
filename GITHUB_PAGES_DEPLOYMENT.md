# GitHub Pages 배포 가이드

## 1단계: GitHub 저장소 생성

1. GitHub (https://github.com) 로그인
2. **New** 클릭 → 새 저장소 생성
3. 저장소 이름: `problem-maker` (또는 원하는 이름)
4. **Public** 선택 (GitHub Pages는 public 저장소 필수)
5. **Create repository** 클릭

## 2단계: 로컬 파일 업로드

### 방법 A: Git 명령어 사용 (권장)

```bash
# 프로젝트 폴더로 이동
cd c:\Users\User\Desktop\1

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Physics problem solver app"

# GitHub 저장소 연결 (YOUR_USERNAME을 본인 GitHub username으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/problem-maker.git

# main 브랜치로 이름 변경 (필요시)
git branch -M main

# 업로드
git push -u origin main
```

### 방법 B: GitHub 웹 페이지에서 직접 업로드

1. GitHub 저장소 페이지 열기
2. **Add file** → **Upload files** 클릭
3. 모든 프로젝트 파일을 드래그 & 드롭
4. **Commit changes** 클릭

## 3단계: GitHub Pages 활성화

1. 저장소 페이지에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Pages** 선택
3. **Source** 섹션:
   - **Branch**: `main` 선택
   - **Folder**: `/ (root)` 선택
4. **Save** 클릭

배포가 완료되면 다음과 같은 링크가 표시됩니다:
```
https://YOUR_USERNAME.github.io/problem-maker/
```

## 4단계: 배포 확인

약 1-2분 후, 위 링크에 접속하여 앱이 정상 작동하는지 확인합니다.

- ✅ 문제 선택 페이지 로드됨
- ✅ 난이도/유형 선택 가능
- ✅ "문제 생성" 버튼 클릭 시 문제 출제
- ✅ 문제 풀이 가능
- ✅ 오답노트, 통계 대시보드 정상 작동

## 5단계: 업데이트 (선택사항)

파일을 수정한 후:

```bash
git add .
git commit -m "Update: 변경 사항 설명"
git push
```

GitHub Pages는 자동으로 업데이트됩니다 (배포 완료까지 1-2분 소요).

## 🎉 완료!

이제 다른 사람들과 링크를 공유할 수 있습니다:
```
https://YOUR_USERNAME.github.io/problem-maker/
```

## 📝 추가 팁

### 커스텀 도메인 사용 (선택사항)
GitHub Pages에서 원하는 도메인을 사용할 수 있습니다.
Settings → Pages → Custom domain에서 설정

### .gitignore 유지
`.gitignore` 파일이 이미 포함되어 있으므로, `.env`나 다른 민감한 정보는 자동으로 업로드되지 않습니다.

---

**배포 완료! Happy Learning! 🎓**
