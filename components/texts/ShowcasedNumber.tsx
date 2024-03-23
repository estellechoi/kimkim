import LoadingRows from '@/components/LoadingRows';
import NumberText from '@/components/NumberText';

type ShowcasedNumberProps = {
  formattedNumber?: string;
  unit?: string;
  isLoading: boolean;
};

const ShowcasedNumber = ({ formattedNumber, unit, isLoading }: ShowcasedNumberProps) => {
  return isLoading ? (
    <LoadingRows color="on_primary" fontClassName="Font_data_32px_num" />
  ) : (
    <NumberText color="body" size="xl" type="small_fractions" formattedNumber={formattedNumber} unit={unit} animate />
  );
};

export default ShowcasedNumber;
