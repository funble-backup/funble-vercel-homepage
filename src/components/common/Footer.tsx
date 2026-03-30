import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#2b2b2b] text-gray-300">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* 상단: 회사 정보 + 투자 유의사항 */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* 회사 정보 */}
          <div className="flex-1">
            <h3 className="text-white font-bold text-base mb-4">주식회사 펀블</h3>
            <div className="text-sm text-gray-400 leading-7 mb-4">
              <p>
                <span>대표 : 조찬식</span>
                <span className="ml-4">사업자등록번호 : 822-87-01619</span>
              </p>
              <p>(07238)서울특별시 영등포구 국회대로72길 4 (여의도동), 9층</p>
            </div>
            <div className="text-sm text-gray-400 space-y-1 mb-6">
              <p>
                <span className="text-gray-500">대표전화</span>
                <span className="ml-2">1661-3258</span>
              </p>
              <p>
                <span className="text-gray-500">대표메일</span>
                <span className="ml-2">contact@funble.kr</span>
              </p>
              <p>
                <span className="text-gray-500">운영시간</span>
                <span className="ml-2">평일 09시~18시(점심 12시~13시)</span>
              </p>
            </div>
            {/* 소셜 링크 */}
            <div className="flex gap-3">
              <a
                href="https://blog.naver.com/funble_official"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/images/social/btn_social_naver.png" alt="NAVER" width={36} height={36} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCvFbkbqvBtVakOijwDe-6Ag"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/images/social/btn_social_youtobe.png" alt="YOUTUBE" width={35} height={35} />
              </a>
              <a
                href="http://pf.kakao.com/_Uxoxbnb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/images/social/btn_social_kakao.png" alt="KAKAO" width={36} height={36} />
              </a>
              <a
                href="https://www.instagram.com/funble_official/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/images/social/btn_social_instagram.png" alt="INSTAGRAM" width={35} height={35} />
              </a>
            </div>
          </div>

          {/* 투자 유의사항 */}
          <div className="flex-1">
            <h3 className="text-white font-bold text-base mb-4">투자 유의사항</h3>
            <ul className="text-xs text-gray-500 space-y-1.5 list-disc list-inside leading-5">
              <li>펀블의 DAS매매는 다자간상대매매 방식입니다.</li>
              <li>일간 매매회전율은 100%로 제한됩니다.</li>
              <li>거래수수료는 거래액의 0.22%(부가세 포함)입니다.</li>
              <li>부동산 자산가격 변동 등에 따라 원금손실(0~100%)이 발생할 수 있으며, 이는 투자자에게 귀속됩니다.</li>
              <li>DAS는 예금자보호법상 보호상품이 아닙니다.</li>
              <li>투자자는 투자 전 투자대상, 보수, 수수료 등에 대해 투자설명서 및 약관을 반드시 확인해주시기 바랍니다.</li>
              <li>펀블 서비스는 금융위원회로부터 혁신금융서비스 지정을 받아 시험 운영 중이며, 그로 인해 예상하지 못한 위험이 발생할 수 있습니다.</li>
            </ul>
          </div>
        </div>

        {/* 약관 링크 */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-wrap gap-4 text-sm">
          <Link href="/clause" className="text-gray-400 hover:text-white transition-colors">
            서비스이용약관
          </Link>
          <Link href="/service" className="text-gray-400 hover:text-white transition-colors">
            전자금융거래이용약관
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
            개인정보처리방침
          </Link>
        </div>

        {/* 인증 배너 */}
        <div className="mt-6 flex flex-wrap gap-8 items-center">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <Image
              src="/images/footer/icon_foot01.jpg"
              alt="금융위원회 혁신금융서비스 지정기업"
              width={42}
              height={41}
              className="shrink-0"
            />
            <span>금융위원회 혁신금융서비스<br />지정기업</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <Image
              src="/images/footer/symbol_ISO27001_new.png"
              alt="ISO27001 인증"
              width={44}
              height={41}
              className="shrink-0"
            />
            <span>정보보호 국제표준<br />ISO27001 인증 획득</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <Image
              src="/images/footer/meritz_logo.png"
              alt="메리츠화재 개인정보보호배상책임보험"
              width={80}
              height={39}
              className="shrink-0"
            />
            <span>개인정보보호배상책임보험 II<br />가입인증</span>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Copyright &copy; FUNBLE Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
