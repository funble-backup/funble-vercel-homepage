import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "funble.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS terms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    version_date TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(type, version_date)
  );
`);

const insert = db.prepare(
  "INSERT OR REPLACE INTO terms (type, version_date, content) VALUES (?, ?, ?)"
);

// 서비스이용약관
const clauseContent = `<div style="text-align:center;margin-bottom:24px;"><h2 style="font-size:20px;font-weight:bold;">서비스이용약관</h2></div>
<div style="border:1px solid #e5e7eb;border-radius:8px;padding:32px;">
<h3 style="text-align:center;font-size:18px;font-weight:bold;margin-bottom:24px;">제1 장 총칙</h3>

<h4 style="font-weight:bold;margin-top:20px;">제1조 (목적)</h4>
<p>이 약관은 주식회사 펀블(이하 "회사")이 운영하는 펀블플랫폼(이하 "플랫폼")에서 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

<h4 style="font-weight:bold;margin-top:20px;">제2조 (정의)</h4>
<p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>"펀블플랫폼"이란 DAS(디지털자산증권)의 청약, 매매거래, 수익배분 등의 서비스를 제공하는 온라인 플랫폼을 말합니다.</li>
<li>"회원"이란 이 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.</li>
<li>"일반회원"이란 플랫폼에 회원가입을 완료한 자로서 정보 열람이 가능한 회원을 말합니다.</li>
<li>"투자회원"이란 제휴계좌를 개설하고 실제 거래가 가능한 회원을 말합니다.</li>
<li>"DAS"란 디지털자산증권(Digital Asset Securities)을 말합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제3조 (약관의 효력 및 변경)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>이 약관은 플랫폼에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
<li>회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.</li>
<li>약관이 변경되는 경우 회사는 변경 내용을 시행일 7일 전부터 플랫폼에 공지합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제4조 (회원가입 및 자격)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>만 19세 이상의 대한민국 국적자에 한하여 회원가입이 가능합니다.</li>
<li>회원가입은 실명 기반으로 이루어져야 합니다.</li>
<li>투자회원은 별도의 제휴계좌 개설이 필요합니다.</li>
<li>회사는 다음 각 호에 해당하는 경우 회원가입을 거부할 수 있습니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제5조 (서비스의 내용)</h4>
<p>회사가 제공하는 서비스는 다음과 같습니다.</p>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>DAS 청약 서비스</li>
<li>DAS 매매거래 서비스 (다자간상대매매 방식)</li>
<li>수익배분 서비스</li>
<li>투자 관련 정보 제공 서비스</li>
<li>기타 회사가 정하는 서비스</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제6조 (거래 및 수수료)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>투자회원은 제휴계좌 예수금 범위 내에서만 청약 및 매매가 가능합니다.</li>
<li>일간 매매회전율은 100%로 제한됩니다.</li>
<li>거래수수료는 거래액의 0.22%(부가세 포함)이며, 변경 시 사전 공지합니다.</li>
<li>미수금 발생 시 회사가 대납 후 이자와 함께 회원에게 청구할 수 있습니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제7조 (개인정보 보호)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>회사는 회원의 개인정보를 관련 법령에 따라 보호하며, 동의 없이 제3자에게 제공하지 않습니다.</li>
<li>탈퇴 후에도 관련 법령에 따라 5년간 거래기록을 보관합니다.</li>
<li>개인정보의 수집, 이용, 제공에 관한 세부사항은 개인정보처리방침에 따릅니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제8조 (회사의 책임 제한)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>회사는 통신사 장애, 외주시스템 오류, 천재지변 등 불가항력 사유로 인한 손해에 대해 책임을 지지 않습니다.</li>
<li>단, 접근매체의 위조 또는 거래처리 오류로 인한 손해는 회사가 배상합니다.</li>
<li>회원의 귀책사유로 발생한 손해에 대해서는 회사가 책임을 지지 않습니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제9조 (투자 유의사항)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>본 서비스는 금융위원회로부터 혁신금융서비스 지정을 받아 시험 운영 중입니다.</li>
<li>부동산 자산가격 변동 등에 따라 투자원금 손실(0~100%)이 발생할 수 있으며, 이는 투자자에게 귀속됩니다.</li>
<li>DAS는 예금자보호법상 보호상품이 아닙니다.</li>
<li>투자자는 투자 전 투자대상, 보수, 수수료 등에 대해 투자설명서 및 약관을 반드시 확인하시기 바랍니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제10조 (분쟁 해결)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>서비스 이용과 관련한 분쟁은 회사의 고객센터를 통해 우선 해결합니다.</li>
<li>분쟁이 해결되지 않는 경우 금융분쟁조정위원회에 조정을 신청할 수 있습니다.</li>
<li>이 약관에서 정하지 않은 사항은 관련 법령 및 상관례에 따릅니다.</li>
</ul>
</div>`;

const clauseContentOld = `<div style="text-align:center;margin-bottom:24px;"><h2 style="font-size:20px;font-weight:bold;">서비스이용약관</h2></div>
<div style="border:1px solid #e5e7eb;border-radius:8px;padding:32px;">
<h3 style="text-align:center;font-size:18px;font-weight:bold;margin-bottom:24px;">제1 장 총칙</h3>

<h4 style="font-weight:bold;margin-top:20px;">제1조 (목적)</h4>
<p>이 약관은 주식회사 펀블(이하 "회사")이 운영하는 펀블플랫폼에서 제공하는 서비스의 이용에 관한 사항을 규정함을 목적으로 합니다.</p>

<h4 style="font-weight:bold;margin-top:20px;">제2조 (정의)</h4>
<p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>"펀블플랫폼"이란 DAS의 청약, 매매거래 등의 서비스를 제공하는 온라인 플랫폼을 말합니다.</li>
<li>"회원"이란 이 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.</li>
</ul>
</div>`;

// 전자금융거래이용약관
const serviceContent = `<div style="text-align:center;margin-bottom:24px;"><h2 style="font-size:20px;font-weight:bold;">전자금융거래이용약관</h2></div>
<div style="border:1px solid #e5e7eb;border-radius:8px;padding:32px;">
<h3 style="text-align:center;font-size:18px;font-weight:bold;margin-bottom:24px;">제1 장 총칙</h3>

<h4 style="font-weight:bold;margin-top:20px;">제1조 (목적)</h4>
<p>이 약관은 주식회사 펀블(이하 "회사")이 제공하는 전자금융거래 서비스를 고객이 이용함에 있어, 회사와 고객 간의 전자금융거래에 관한 기본적인 사항을 정함을 목적으로 합니다.</p>

<h4 style="font-weight:bold;margin-top:20px;">제2조 (정의)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>"전자금융거래"란 회사가 전자적 장치를 통하여 금융상품 및 서비스를 제공하고, 고객이 자동화된 방식으로 이를 이용하는 거래를 말합니다.</li>
<li>"전자적 장치"란 전자금융거래정보를 전자적 방법으로 전송하거나 처리하는 데 이용되는 장치를 말합니다.</li>
<li>"접근매체"란 전자금융거래에 있어서 거래지시를 하거나 이용자 및 거래내용의 진실성과 정확성을 확보하기 위하여 사용되는 수단 또는 정보를 말합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제3조 (약관의 명시 및 변경)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>회사는 고객이 전자금융거래를 하기 전에 이 약관의 중요한 내용을 고객이 이해할 수 있도록 전자적 장치에 게시합니다.</li>
<li>회사는 약관을 변경하는 경우 변경되는 약관의 시행일 1개월 전에 홈페이지에 게시합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제4조 (전자금융거래 계약의 체결)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>고객은 이 약관 및 개별약관의 내용에 동의하고, 회사가 정한 절차에 따라 전자금융거래 이용을 신청합니다.</li>
<li>회사는 고객의 신청이 적합하다고 인정하는 경우 전자금융거래 서비스 이용을 승낙합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제5조 (이용 시간)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>회사는 전자금융거래의 이용이 가능한 시간을 전자적 장치에 공시합니다.</li>
<li>시스템 점검, 장애 등의 사유로 서비스 이용이 제한될 수 있으며, 이 경우 사전에 고지합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제6조 (수수료)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>회사는 전자금융거래와 관련하여 수수료를 부과할 수 있으며, 수수료의 종류와 금액은 전자적 장치에 공시합니다.</li>
<li>수수료 변경 시 충분한 사전 고지를 제공합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제7조 (거래 내용의 확인)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>고객은 전자적 장치를 통하여 언제든지 거래 내용을 확인할 수 있습니다.</li>
<li>고객이 서면으로 거래 내용의 제공을 요청하는 경우, 회사는 요청을 받은 날로부터 2주 이내에 제공합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제8조 (오류의 정정)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>고객은 전자금융거래에 오류가 있음을 안 때에는 회사에 대하여 그 정정을 요구할 수 있습니다.</li>
<li>회사는 오류의 정정 요구를 받은 때에는 이를 즉시 조사하여 처리한 후 그 결과를 고객에게 알려야 합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제9조 (회사의 책임)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>회사는 접근매체의 위조나 변조로 발생한 사고로 인하여 고객에게 손해가 발생한 경우에는 그 손해를 배상할 책임을 집니다.</li>
<li>다만, 고객의 고의 또는 중과실로 인한 경우에는 회사의 책임을 제한할 수 있습니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제10조 (분쟁 처리 및 조정)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>고객은 전자금융거래와 관련하여 이의가 있는 경우 회사에 직접 요청하거나 금융분쟁조정위원회에 조정을 신청할 수 있습니다.</li>
<li>회사는 고객의 이의 요청에 대하여 15일 이내에 처리 결과를 통보합니다.</li>
</ul>
</div>`;

// 개인정보처리방침
const privacyContent = `<div style="text-align:center;margin-bottom:24px;"><h2 style="font-size:20px;font-weight:bold;">개인정보처리방침</h2></div>
<div style="border:1px solid #e5e7eb;border-radius:8px;padding:32px;">

<p>주식회사 펀블(이하 "회사")은 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 관련 법령에 의거한 개인정보처리방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다.</p>

<h4 style="font-weight:bold;margin-top:20px;">제1조 (개인정보의 처리 목적)</h4>
<p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 다음의 목적 외의 용도로는 사용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>회원 가입 및 관리</li>
<li>재화 또는 서비스 제공 (투자상품 거래)</li>
<li>온라인 금융 활동 지원</li>
<li>서비스 홍보 및 마케팅</li>
<li>법적 의무 이행</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제2조 (개인정보의 처리 및 보유 기간)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>회원 정보: 회원가입 시점부터 회원 탈퇴 시까지 보유합니다.</li>
<li>전자금융거래에 관한 기록: 5년</li>
<li>계약 또는 청약철회에 관한 기록: 5년</li>
<li>소비자 불만 또는 분쟁 처리에 관한 기록: 3년</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제3조 (수집하는 개인정보의 항목)</h4>
<p><strong>필수 항목</strong></p>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>성명, 생년월일, 성별</li>
<li>휴대전화번호, 이메일</li>
<li>CI(연계정보)</li>
</ul>
<p style="margin-top:12px;"><strong>투자회원 추가 항목</strong></p>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>계좌정보, 투자성향 정보</li>
<li>신분증 정보 (본인확인용)</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제4조 (개인정보의 제3자 제공)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>SK증권: 제휴계좌 개설 및 금융거래 처리 목적</li>
<li>키움증권: 조각투자 서비스 제공 목적</li>
<li>법령에 의거하거나 수사기관의 요청이 있는 경우</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제5조 (개인정보의 안전성 확보 조치)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>관리적 조치: 내부관리계획 수립, 정기적 직원 교육</li>
<li>기술적 조치: 비밀번호 암호화, 접근권한 관리, 침입방지시스템 운영</li>
<li>물리적 조치: 전산실 및 자료보관실 접근 통제</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제6조 (정보주체의 권리와 행사 방법)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>고객은 언제든지 개인정보의 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.</li>
<li>권리 행사는 고객만족센터(privacy@funble.kr)를 통해 가능합니다.</li>
<li>회사는 요청을 받은 날로부터 10일 이내에 조치 결과를 통보합니다.</li>
</ul>

<h4 style="font-weight:bold;margin-top:20px;">제7조 (개인정보 보호책임자)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>개인정보 보호책임자: 김도형 (CPO)</li>
<li>소속: 정보보호부문</li>
<li>연락처: 02-1661-3258</li>
<li>이메일: privacy@funble.kr</li>
</ul>
</div>`;

const privacyContentOld = `<div style="text-align:center;margin-bottom:24px;"><h2 style="font-size:20px;font-weight:bold;">개인정보처리방침</h2></div>
<div style="border:1px solid #e5e7eb;border-radius:8px;padding:32px;">
<p>주식회사 펀블(이하 "회사")은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하기 위해 다음과 같은 처리방침을 수립합니다.</p>

<h4 style="font-weight:bold;margin-top:20px;">제1조 (개인정보의 처리 목적)</h4>
<p>회사는 회원 가입, 서비스 제공, 법적 의무 이행 등의 목적으로 개인정보를 처리합니다.</p>

<h4 style="font-weight:bold;margin-top:20px;">제2조 (수집하는 개인정보)</h4>
<ul style="list-style:disc;padding-left:20px;margin-top:8px;">
<li>성명, 생년월일, 연락처, 이메일</li>
</ul>
</div>`;

// 시드 데이터 삽입
const transaction = db.transaction(() => {
  // 서비스이용약관
  insert.run("clause", "2024.12.05", clauseContent);
  insert.run("clause", "2022.05.03", clauseContentOld);

  // 전자금융거래이용약관
  insert.run("service", "2022.05.03", serviceContent);

  // 개인정보처리방침
  insert.run("privacy", "2025.05.26", privacyContent);
  insert.run("privacy", "2024.12.05", privacyContentOld);
});

transaction();

console.log("✅ 약관 시드 데이터 삽입 완료");
db.close();
