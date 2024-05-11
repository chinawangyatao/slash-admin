import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { MdArrowBackIosNew } from 'react-icons/md';

interface ReturnButtonProps {
  onClick?: () => void;
}
export function ReturnButton({ onClick }: ReturnButtonProps) {
  const { t } = useTranslation();
  return (
    <Button block type="text" onClick={onClick}>
      <div className="flex items-center justify-center ">
        <MdArrowBackIosNew />
        <span className="text-sm">{t('sys.login.backSignIn')}</span>
      </div>
    </Button>
  );
}
