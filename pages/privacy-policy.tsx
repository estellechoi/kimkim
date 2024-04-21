import type { NextPage } from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';

const PrivacyPolicy: NextPage = () => {
  return (
    <Main className="max-w-content_max_width mx-auto Font_body_md space-y-page_gap pt-page_top pb-page_bottom px-page_x">
      <Heading tagName="h2">개인정보처리방침</Heading>

      <p>
        <em>마지막 수정일: 2024년 4월 21일</em>
      </p>

      <p>
        &quot;KimKim&quot;은 사용자의 프라이버시를 존중하고 개인정보 보호를 매우 중요시합니다. 본 개인정보처리방침은 &quot;KimKim&quot; 앱(이하 &quot;앱&quot;)을 이용하는 
        과정에서 사용자에게서 수집할 수 있는 정보와 그 사용 방법에 대해 설명합니다.
      </p>

      <h3>1. 개인정보 수집 및 이용 목적</h3>

      <p>
        &quot;KimKim&quot;은 Mixpanel을 통해 사용자의 사이트 이용 행동 데이터를 수집하며, 이는 사용자 경험 개선, 서비스 이용 통계의 목적으로만 활용됩니다. 
        회원가입이 필요 없기 때문에, 식별 가능한 개인정보는 수집되지 않습니다.
      </p>

      <h3>2. 수집하는 비개인정보의 항목 및 수집 방법</h3>

      <ul className="list-disc list-outside pl-4">
        <li>
          수집 정보: 방문 일시, 서비스 이용 기록, 접속 빈도, 브라우저 종류 등
        </li>

        <br />

        <li>
          수집 방법: 웹사이트 방문 및 이용 시 자동으로 수집됩니다.
        </li>
      </ul>

      <h3>3. 개인정보의 처리 및 보유 기간</h3>

      <p>
        수집된 정보는 명시된 목적 외의 용도로 사용되지 않으며, 이용 목적이 달성된 후 즉시 파기됩니다. 단, 법령에 의거하여 보관이 필요한 경우는 그에 따릅니다.
      </p>

      <h3>4. 개인정보의 파기 절차 및 방법</h3>

      <p>
        전자적 파일 형태로 저장된 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 완전히 파기합니다.
      </p>

      <h3>5. 개인정보 제공</h3>

      <p>
        &quot;KimKim&quot;은 사용자의 개인정보를 제3자에게 제공하지 않습니다.
      </p>

      <h3>6. 유럽 연합 데이터 주체에 대한 공개 사항</h3>

      <p>
        우리는 위에서 설명된 목적을 위해 개인 데이터를 처리합니다. 귀하의 데이터를 처리하는 근거로는: (i) 하나 이상의 구체적인 목적을 위해 귀하가 우리 또는 
        우리 서비스 제공자에게 동의를 제공한 경우; (ii) 계약 이행을 위해 처리가 필요한 경우; (iii) 법적 의무 준수를 위해 처리가 필요한 경우; 및/또는 
        (iv) 우리 또는 제3자가 추구하는 정당한 이익을 위해 처리가 필요하고, 귀하의 이익 및 기본적 권리와 자유가 그 이익을 침해하지 않는 경우에 해당됩니다.
      </p>

      <h3>7. 방침 변경사항</h3>

      <p>
        이 방침에 중대한 변경이 이루어질 경우, 앱을 통해 여러분에게 통지할 것입니다. 그럼에도 불구하고, 서비스의 지속적인 사용은 이 정책 및 기타 회사 약관에 대한 
        주기적인 검토를 반영하며, 그 약관에 대한 여러분의 동의를 나타냅니다.
      </p>
    </Main>
  );
};

export default PrivacyPolicy;
