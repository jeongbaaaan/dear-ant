#!/bin/bash
set -e

# Dear,ANT 배포 스크립트
# 사용법: ./deploy.sh [preview|production]

ENV="${1:-preview}"

echo ""
echo "  🐜 Dear,ANT 배포 도우미"
echo "  ========================"
echo ""

# 1. Vercel CLI 확인
if ! command -v vercel &> /dev/null; then
  echo "📦 Vercel CLI가 없어서 설치할게요. 잠깐만요..."
  npm i -g vercel
  echo ""
fi

# 2. 로그인 확인
if ! vercel whoami &> /dev/null 2>&1; then
  echo "🔐 Vercel 로그인이 필요해요!"
  echo ""
  echo "   브라우저가 열리면 로그인해주세요."
  echo "   (GitHub 계정 또는 이메일로 로그인)"
  echo ""
  read -p "   준비됐으면 Enter 눌러주세요... "
  echo ""
  vercel login
fi

ACCOUNT=$(vercel whoami 2>/dev/null)
echo "✅ 로그인된 계정: $ACCOUNT"
echo ""

# 3. 프로젝트 연결 확인
if [ ! -d ".vercel" ]; then
  echo "📌 이 프로젝트를 Vercel에 처음 연결하는 거예요."
  echo ""
  echo "   아래 질문들이 나올 거예요. 이렇게 답해주세요:"
  echo ""
  echo "   ? Set up and deploy? → Y"
  echo "   ? Which scope? → 본인 계정 선택"
  echo "   ? Link to existing project? → N (새 프로젝트)"
  echo "   ? What's your project's name? → dear-ant (그냥 Enter)"
  echo "   ? In which directory is your code located? → ./ (그냥 Enter)"
  echo "   ? Want to modify these settings? → N"
  echo ""
  read -p "   준비됐으면 Enter 눌러주세요... "
  echo ""
fi

# 4. 빌드 테스트
echo "🔨 빌드 확인 중... (1-2분 걸려요)"
if npm run build > /dev/null 2>&1; then
  echo "✅ 빌드 성공!"
else
  echo "❌ 빌드 실패! 코드에 문제가 있어요."
  echo "   강남한테 연락해주세요 😅"
  exit 1
fi

# 5. 테스트
echo "🧪 테스트 확인 중..."
if npm test > /dev/null 2>&1; then
  echo "✅ 테스트 통과!"
else
  echo "⚠️  테스트 일부 실패. 배포는 계속할게요."
fi

# 6. 배포
echo ""
if [ "$ENV" = "production" ]; then
  echo "🚀 프로덕션에 배포합니다!"
  echo "   (실제 서비스 URL에 반영돼요)"
  echo ""
  vercel --prod
else
  echo "🔍 프리뷰 배포합니다."
  echo "   (테스트용 URL이 생성돼요)"
  echo ""
  vercel
fi

echo ""
echo "  ✨ 배포 완료!"
echo "  위에 나온 URL을 브라우저에서 열어보세요."
echo ""
